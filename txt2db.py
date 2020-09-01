import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ddemo_0507.settings")
import django
django.setup()

def main():
    from search.models import Protein
    f = open('homo_dom_0331_uniq.txt')
    Protein_ls = []
    for line in f:
        parts = line.split()
        parts = [x.strip() for x in parts]
        protein = Protein(unp_id=parts[0],length=parts[1], domain_num=parts[2], domain=parts[3])
        Protein_ls.append(protein)
    f.close()
     
    Protein.objects.bulk_create(Protein_ls)
 
if __name__ == "__main__":
    main()
    print('Done!')
