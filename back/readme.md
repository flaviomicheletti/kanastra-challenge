    # Install 
    apt install  python3-venv 

    # create
    python3 -m venv .venv

    # activate
    . .venv/bin/activate

    pip install pytest httpx

    pip install pytest-cov

    pytest --cov=app app/tests/