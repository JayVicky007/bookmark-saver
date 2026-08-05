import requests
from bs4 import BeautifulSoup


def scrape_title(url: str):
    """Fetch a page and return its HTML title text."""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
    except requests.RequestException:
        return None

    soup = BeautifulSoup(response.text, "html.parser")
    title_tag = soup.title
    if title_tag and title_tag.get_text(strip=True):
        return title_tag.get_text(strip=True)
    return None
