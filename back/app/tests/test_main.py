import os
import pytest
from fastapi.testclient import TestClient
from app.main import create_app

UPLOAD_DIRECTORY = "./uploads"

@pytest.fixture(scope="module")
def client():
    app = create_app()
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="function", autouse=True)
def setup_and_teardown():
    # Setup: Ensure the upload directory is clean before each test
    if not os.path.exists(UPLOAD_DIRECTORY):
        os.makedirs(UPLOAD_DIRECTORY)
    yield
    # Teardown: Clean up after each test
    for filename in os.listdir(UPLOAD_DIRECTORY):
        file_path = os.path.join(UPLOAD_DIRECTORY, filename)
        os.unlink(file_path)

def test_upload_file(client):
    file_name = "test.csv"
    file_content = "name,age\nJohn,30\nDoe,25"

    response = client.post("/upload", files={"file": (file_name, file_content, "text/csv")})
    assert response.status_code == 200
    assert response.json() == {"filename": file_name}

    # Ensure the file was created
    assert os.path.exists(os.path.join(UPLOAD_DIRECTORY, file_name))

def test_get_files(client):
    file_name = "test.csv"
    file_content = "name,age\nJohn,30\nDoe,25"

    # Upload a file to ensure there's at least one file in the directory
    client.post("/upload", files={"file": (file_name, file_content, "text/csv")})

    response = client.get("/files")
    assert response.status_code == 200
    files = response.json()["files"]
    assert file_name in files
