
# SwiftyApp

SwiftyApp is an open-source web application designed for selling comic posters. It features a FastAPI backend and uses the Astro framework for the frontend. The project is still under active development, and contributions are welcome!

## 🚀 Project Overview

SwiftyApp provides a simple and user-friendly platform to browse, purchase, and manage comic posters. It aims to deliver a smooth experience for both the buyers and the administrators managing the product catalog.

## 🛠️ Tech Stack

- **Backend:** [FastAPI](https://fastapi.tiangolo.com/)
- **Frontend:** [Astro](https://astro.build/)
- **Database:** PostgreSQL
- **Deployment:** Docker (optional)

## 🔨 Features

- Browse available comic posters.
- Add posters to the cart.
- Purchase posters using a simple checkout flow.
- Admin interface to manage the product catalog (future implementation).

## 🚧 Project Status

This project is currently under development. Some features may be incomplete or missing. Contributions are welcome to help enhance and expand the application's functionality.

## 📦 Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/ndegwa007/swiftyapp.git
    cd swiftyapp
    ```

2. **Backend Setup:**
    - Navigate to the `backend` directory and install dependencies:
    ```bash
    cd backend
    pip install -r requirements.txt
    ```

    - Start the FastAPI server:
    ```bash
    uvicorn main:app --reload
    ```

3. **Frontend Setup:**
    - Navigate to the `frontend` directory and install dependencies:
    ```bash
    cd ../frontend
    npm install
    ```

    - Start the Astro development server:
    ```bash
    npm start
    ```

4. **Access the application:**
    - Visit `http://localhost:4321` to view the frontend.
    - Visit `http://localhost:8000/docs` for the FastAPI API documentation.

## 🗂️ Folder Structure

```
swiftyapp/
├── back/        # FastAPI backend
├── front/       # Astro frontend
└── README.md       # Project documentation
```

## 💡 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request to help improve SwiftyApp.

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a pull request.

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

## 📧 Contact

For questions or feedback, please contact [ndegwa](mailto:ndegwa8781@gmail.com).
