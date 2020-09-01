from django.db import models

# Create your models here.
class Protein_new(models.Model):
    unp_id = models.CharField(max_length=10)
    organism = models.CharField(max_length=30)
    length = models.IntegerField()
    seq = models.CharField(max_length=2000)
    domain_num = models.IntegerField()
    domain = models.CharField(max_length=50)
