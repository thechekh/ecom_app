# Generated by Django 5.0.2 on 2025-03-05 12:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("orders", "0002_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="contact_info",
            field=models.JSONField(default=dict),
        ),
    ]
