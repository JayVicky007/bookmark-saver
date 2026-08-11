# Create your views here.

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Bookmark
from .scraper import scrape_title

@api_view(['POST'])
def add_bookmark(request):
    # 1. Get the URL from the React frontend request data
    url = request.data.get('url')
    notes = request.data.get('notes', '') # Default to empty text if no notes provided
    
    if not url:
        return Response({"error": "URL field is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    # 2. Run our BeautifulSoup scraping function
    scraped_title = scrape_title(url)
    
    # 3. Create and save the Bookmark in our PostgreSQL/SQLite database
    bookmark = Bookmark.objects.create(
        url=url,
        title=scraped_title if scraped_title else "Untitled Website",
        notes=notes
    )
    
    # 4. Send back a JSON response stating it was successful
    return Response({
        "message": "Bookmark saved successfully!",
        "id": bookmark.id,
        "title": bookmark.title,
        "url": bookmark.url
    }, status=status.HTTP_201_CREATED)



@api_view(['GET'])
def get_bookmarks(request):
    # 1. Grab all bookmark rows from the database
    bookmarks = Bookmark.objects.all().order_by('-created_at')
    
    # 2. Build a raw Python list of dictionaries to hold the data
    data = []
    for b in bookmarks:
        data.append({
            "id": b.id,
            "url": b.url,
            "title": b.title,
            "notes": b.notes,
            "created_at": b.created_at
        })
        
    # 3. Send the list back as a clean JSON payload
    return Response(data, status=status.HTTP_200_OK)



@api_view(['DELETE'])
def delete_bookmark(request, pk):
    """
    Deletes a specific bookmark by its Primary Key (ID).
    """
    try:
        # Find the single bookmark record by its ID
        bookmark = Bookmark.objects.get(pk=pk)
        bookmark.delete()  # Remove it from SQLite
        return Response({'message': 'Bookmark deleted successfully'}, status=status.HTTP_200_OK)
    except Bookmark.DoesNotExist:
        # Return a 404 if the ID doesn't exist in the database
        return Response({'error': 'Bookmark not found'}, status=status.HTTP_404_NOT_FOUND)

