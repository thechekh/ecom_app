from django.contrib import admin
from .models import Post, PostImage

class PostImageInline(admin.TabularInline):
    model = PostImage
    extra = 1

class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'caption', 'price', 'created_at')
    list_filter = ('created_at', 'user')
    search_fields = ('caption', 'user__username')
    inlines = [PostImageInline]
    readonly_fields = ('created_at', 'updated_at')

admin.site.register(Post, PostAdmin)
admin.site.register(PostImage)
