from django.db import models


from django.db import models

class Bookmark(models.Model):
    url = models.URLField(max_length=500)
    title = models.CharField(max_length=255, blank=True)  # Added blank=True
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # Python fallback: if title exists use it, otherwise show the URL
        return self.title if self.title else self.url
