# Generated by Django 3.0.5 on 2020-04-20 17:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('verify_code', '0003_auto_20200416_0157'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Verify',
            new_name='SendVerifyCode',
        ),
    ]
