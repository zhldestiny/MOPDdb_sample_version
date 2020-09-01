import os, sys
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "demo_0507.settings")
import django
django.setup()
from search.models import Protein_new

if __name__ == "__main__":
    #Protein_ls = []
    file_path = os.path.dirname(os.path.abspath(__file__))
    organism_path = os.path.join(file_path, "file/sample_0615/")
    organism_ls = os.listdir(organism_path)
    for organism in organism_ls:
        if organism == 'SARSCoV2':
            # organism_name = organism.split("_")[0]+" "+organism.split("_")[1]
            organism_name = organism
            entry_ls = os.listdir(os.path.join(organism_path, organism))
            for entry in entry_ls:
                # read xxx.dcd and seq.txt
                dcd_file = os.path.join(organism_path, organism, entry, entry+".dcd")
                seq_file = os.path.join(organism_path, organism, entry, "seq.txt")
                f=open(dcd_file, "r")
                line = f.readline()
                length, domain_num, domain = line.split()[1], line.split()[2], line.split()[3]
                f.close()
                f=open(seq_file, "r")
                seq_ls = f.readlines()
                seq_str = ""
                for x in seq_ls[1:]:
                    seq_str+=x
                f.close()
                # 写入数据库
                #protein = Protein(unp_id=entry, organism=organism_name, length=length, domain_num=domain_num, domain=domain, seq=seq_str)
                Protein_new.objects.get_or_create(unp_id=entry, organism=organism_name, length=length, domain_num=domain_num, domain=domain, seq=seq_str)
                #Protein_ls.append(protein)
        #Protein.objects.bulk_create(Protein_ls)
