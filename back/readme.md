# Back-end

    python3 -m venv .venv

    . .venv/bin/activate

    pip install --upgrade pip
    pip install -r app/requirements.txt

    uvicorn app.main:app --reload

    pytest

    pytest --cov=app app/tests/