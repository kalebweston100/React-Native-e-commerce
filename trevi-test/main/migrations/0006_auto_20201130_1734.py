# Generated by Django 3.1.2 on 2020-11-30 17:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0005_auto_20201130_0504'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='grantimage',
            name='path',
        ),
        migrations.AddField(
            model_name='grantimage',
            name='image',
            field=models.ImageField(default='test', upload_to=''),
            preserve_default=False,
        ),
    ]
