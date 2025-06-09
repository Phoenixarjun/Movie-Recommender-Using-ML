from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle, requests, os, json, logging
from dotenv import load_dotenv

load_dotenv()
OMDB_API_KEY = os.getenv("OMDB_API_KEY")
CACHE_PATH = "./static/data.json"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

movies = pickle.load(open('./artifacts/movie.pkl', 'rb'))
similarity = pickle.load(open('./artifacts/similarity.pkl', 'rb'))

def ensure_cache_file():
    if not os.path.exists(CACHE_PATH) or os.stat(CACHE_PATH).st_size == 0:
        with open(CACHE_PATH, 'w') as f:
            json.dump({}, f)

ensure_cache_file()

def load_cached_data():
    try:
        with open(CACHE_PATH, 'r') as file:
            content = file.read().strip()
            return json.loads(content) if content else {}
    except json.JSONDecodeError as e:
        logger.error(f"Corrupted cache file: {e}")
        return {}

def save_cached_data(data):
    with open(CACHE_PATH, 'w') as file:
        json.dump(data, file, indent=2)

class MovieRequest(BaseModel):
    title: str

def fetch_movie_details(title):
    url = f"http://www.omdbapi.com/?t={title}&apikey={OMDB_API_KEY}"
    res = requests.get(url).json()
    return {
        "title": title,
        "poster": res.get("Poster", ""),
        "rating": res.get("imdbRating", "N/A"),
        "year": res.get("Year", "N/A"),
        "runtime": res.get("Runtime", "N/A"),
        "genre": res.get("Genre", "N/A"),
        "votes": res.get("imdbVotes", "N/A"),
        "plot": res.get("Plot", "No description available"),
        "director": res.get("Director", "N/A"),
        "actors": res.get("Actors", "N/A"),
        "country": res.get("Country", "N/A"),
        "language": res.get("Language", "N/A")
    }

@app.get("/", response_class=HTMLResponse)
async def read_index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/search_movies", response_class=HTMLResponse)
async def search_movies(request: Request):
    return templates.TemplateResponse("search.html", {"request": request})

@app.get("/movie/{movie_title}", response_class=HTMLResponse)
async def movie_detail(request: Request, movie_title: str):
    details = fetch_movie_details(movie_title)
    return templates.TemplateResponse("movie.html", {
        "request": request,
        "movie": details
    })

@app.get("/all-movies")
async def get_all_movies():
    logger.info("Fetching all movies")
    try:
        cached_data = load_cached_data()
        movie_titles = movies['title'].tolist()
        results = []

        for i, title in enumerate(movie_titles[:1000]):
            if title in cached_data:
                logger.info(f"Using cached data for: {title}")
                results.append(cached_data[title])
                continue

            logger.info(f"Fetching from OMDb for: {title}")
            try:
                url = f"http://www.omdbapi.com/?t={title}&apikey={OMDB_API_KEY}"
                res = requests.get(url)
                res.raise_for_status()
                data = res.json()

                if data.get('Response') == 'False':
                    logger.warning(f"OMDB API error for {title}: {data.get('Error')}")
                    continue

                movie_data = {
                    "id": title.replace(" ", "%20"),
                    "title": title,
                    "poster": data.get("Poster", ""),
                    "rating": data.get("imdbRating", "N/A"),
                    "year": data.get("Year", "N/A"),
                    "runtime": data.get("Runtime", "N/A"),
                    "genre": data.get("Genre", "N/A"),
                    "votes": data.get("imdbVotes", "N/A")
                }

                results.append(movie_data)
                cached_data[title] = movie_data

            except Exception as e:
                logger.error(f"Error processing {title}: {str(e)}")
                continue

        save_cached_data(cached_data)
        logger.info(f"Returning {len(results)} movies")
        return {"movies": results}

    except Exception as e:
        logger.error(f"Error in get_all_movies: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/movies/{title}/recommendations")
async def get_recommendations(title: str):
    if title not in movies['title'].values:
        return {"error": "Movie not found"}

    idx = movies[movies['title'] == title].index[0]
    distances = sorted(list(enumerate(similarity[idx])), key=lambda x: x[1], reverse=True)
    recommendations = []

    for i in distances[1:6]:
        similar_title = movies.iloc[i[0]].title
        try:
            details = fetch_movie_details(similar_title)
            recommendations.append(details)
        except Exception as e:
            logger.error(f"Error fetching details for {similar_title}: {str(e)}")

    return {"recommendations": recommendations}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
