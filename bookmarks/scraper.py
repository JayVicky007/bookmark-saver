import requests
from bs4 import BeautifulSoup


# def scrape_title(url: str):
#     """Fetch a page and return its HTML title text."""
#     try:
#         response = requests.get(url, timeout=10)
#         response.raise_for_status()
#     except requests.RequestException:
#         return None

#     soup = BeautifulSoup(response.text, "html.parser")
#     title_tag = soup.title
#     if title_tag and title_tag.get_text(strip=True):
#         return title_tag.get_text(strip=True)
#     return None


def scrape_title(url):
    # Set a header payload so target servers see us as a standard desktop browser
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    try:
        # Pass the headers dictionary directly into the get call
        response = requests.get(url, headers=headers, timeout=10)
        
        # Check if the website actually allowed us in (raises HTTPError if 403, 404, etc.)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        if soup.title and soup.title.string:
            return soup.title.get_text(strip=True)
            
        return "Untitled Bookmark"
        
    except Exception as e:
        print(f"Scraper Error encountered: {e}")
        return None

