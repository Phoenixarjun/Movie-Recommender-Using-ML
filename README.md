# 🎬 Movie Recommender using Machine Learning

![Python](https://img.shields.io/badge/Python-3.10-blue?logo=python) ![FastAPI](https://img.shields.io/badge/FastAPI-0.95-lightgrey?logo=fastapi) ![Machine Learning](https://img.shields.io/badge/Machine%20Learning-Model-green?logo=scikit-learn) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black) ![NLTK](https://img.shields.io/badge/NLTK-1.4-orange) ![Status](https://img.shields.io/badge/Status-In%20Progress-yellow) ![License](https://img.shields.io/github/license/Phoenixarjun/Movie-Recommender-using-ML)


---

## 🚀 Project Overview

A **cutting-edge Movie Recommendation System** powered by state-of-the-art Machine Learning and Natural Language Processing techniques.  
Users enter a movie they like and get instantly recommended similar movies, enriched with posters, ratings, release years, and more.  

Built with **FastAPI** for blazing-fast backend APIs, a sleek frontend using **HTML5, CSS3, and JavaScript**, and advanced ML powered by **FastAI**, **scikit-learn**, and **NLTK**.

---

## ✨ Features

- 🔍 **Search & Discover:** Type any movie, receive a curated list of similar films based on ML similarity matrix  
- 🤖 **ML Model:** Uses cosine similarity on TF-IDF vectorized movie metadata (title, genre, description)  
- 🧠 **NLP Powered:** Text preprocessing and feature extraction using NLTK for better context understanding  
- ⚡ **FastAPI Backend:** Efficient, async API for real-time recommendations  
- 🖼️ **Dynamic UI:** Movie posters, ratings, release years with graceful fallback for missing images  
- 🔢 **Client-Side Pagination:** Smooth navigation through large movie datasets  
- ☁️ **Scalable:** Easily extensible and deployable on cloud environments  
- 📦 **Git LFS:** Manages large model/data files seamlessly  

---

## 📸 Demo

![Screenshot 2025-06-09 135922](https://github.com/user-attachments/assets/c954269a-98f7-4a12-a859-7bc0f8d69a6a)


![Screenshot 2025-06-09 140035](https://github.com/user-attachments/assets/e4e436f0-222c-4061-9208-340bea964843)


![Screenshot 2025-06-09 140027](https://github.com/user-attachments/assets/6223d541-b7fc-461a-8615-58a5213412a0)


![Screenshot 2025-06-09 135952](https://github.com/user-attachments/assets/da41315f-80f2-44cb-9140-fb07a2389923)


---

## 🛠 Technology Stack

| Layer           | Technology / Library           | Purpose                                     |
|-----------------|-------------------------------|---------------------------------------------|
| Backend         | FastAPI                       | API server, backend logic                    |
|                 | Python 3.10                  | Core programming language                    |
|                 | FastAI                       | ML model training and inference              |
|                 | scikit-learn                 | Similarity matrix & ML algorithms            |
|                 | NLTK                         | Natural Language Processing                   |
| Frontend        | HTML5                        | Semantic markup                              |
|                 | CSS3                         | Styling and layout                           |
|                 | JavaScript                   | Client-side interactivity & pagination       |
| Dev Tools       | Git LFS                      | Large file version control                    |
|                 | Uvicorn                      | ASGI server for FastAPI                       |

---

## 📥 Installation & Setup

### Clone the repository

```bash
git clone https://github.com/Phoenixarjun/Movie-Recommender-using-ML.git
cd Movie-Recommender-using-ML
````

### Install dependencies

```bash
pip install -r requirements.txt
```

### Manage large files with Git LFS (if needed)

```bash
git lfs install
git lfs track "*.pkl"
git add .gitattributes
git commit -m "Track pickle files with Git LFS"
```

### Prepare data and train the model (optional)

If you want to retrain or update the model:

```bash
python scripts/train_model.py
```

### Run the backend server

```bash
uvicorn app:app --reload
```

By default, the app will be accessible at:
`http://localhost:8000`

---

## 🖥 Usage

* Open the frontend in your browser
* Search for your favorite movie
* Browse recommended movies with posters, ratings, and release years
* Use pagination to explore more titles

---


## 🔧 How it Works

1. **Data Processing:** Movie metadata is vectorized using TF-IDF and processed via NLTK for tokenization, stopword removal, and stemming.
2. **Model Training:** FastAI and scikit-learn calculate cosine similarity on vectors to build the recommendation matrix.
3. **Backend API:** FastAPI exposes endpoints to query movie recommendations in real-time.
4. **Frontend UI:** JavaScript fetches API data, dynamically rendering movie cards and managing pagination for smooth UX.

---

## 🤝 Contributing

Contributions are welcome and encouraged!

* Fork the repository
* Create a feature branch (`git checkout -b feature-name`)
* Commit your changes (`git commit -m 'Add feature'`)
* Push to the branch (`git push origin feature-name`)
* Open a pull request describing your changes

Please ensure code is clean, well-documented, and tested before submitting.

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

## 📬 Contact

**Maintainer:** [PhoenixArjun](https://github.com/Phoenixarjun)
For questions, feature requests, or collaborations, open an issue or contact via GitHub.

---

⭐ If you find this project useful, please give it a star and share it with your network!


