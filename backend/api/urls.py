from django.urls import path
from . import views


urlpatterns = [
    path("spots/", views.SpotListCreate.as_view(), name="spot-list"),
    path("spots/delete/<int:pk>/", views.SpotDelete.as_view(), name="delete-spot"),
    path("users/", views.UserListView.as_view(), name="get-users"),
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note")
]