# Generated by Django 2.2 on 2020-07-07 09:26

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Protein_new',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('unp_id', models.CharField(max_length=10)),
                ('organism', models.CharField(max_length=30)),
                ('length', models.IntegerField()),
                ('seq', models.CharField(max_length=2000)),
                ('domain_num', models.IntegerField()),
                ('domain', models.CharField(max_length=50)),
            ],
        ),
    ]
