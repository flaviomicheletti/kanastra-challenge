import httpx
import asyncio

UPLOAD_URL = "http://localhost:8000/upload"

TEST_FILE_PATH = "../data/input.csv"

async def test_upload_file():
    async with httpx.AsyncClient() as client:
        with open(TEST_FILE_PATH, "rb") as file:
            response = await client.post(
                UPLOAD_URL,
                files={"file": ("test_file.csv", file, "text/csv")}
            )

        assert response.status_code == 200, f"Erro: {response.status_code}, {response.text}"
        assert response.json().get("filename") == "test_file.csv"

if __name__ == "__main__":
    asyncio.run(test_upload_file())
