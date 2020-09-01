from django.shortcuts import render
from .models import Protein_new
from django.http import HttpResponse, HttpResponseRedirect
# Create your views here.
def home(request):
    return render(request, 'home.html', {})    # request是必须的，返回home.html页面，{}参数传给html

def blast(request):
    return render(request, 'blast.html', {})


def do_blast(request):
    # print(request.GET)
    blast_output = run_blast(request)
    line_ls = blast_output.split("\n")
    if line_ls[28] == "***** No hits found *****":
        return render(request, 'do_blast.html', {"blast_output": blast_output})
    else:
        ind = 29
        for line in line_ls[29:]:
            if not line:
                break
            else:
                src = line.split()[0]
                target = "<a href='/{}' target=_blank>{}</a> ".format(src, src)
                line_ls[ind] = line_ls[ind].replace(src, target)
            ind += 1
        blast_output = "\n".join(line_ls)
        return render(request, 'do_blast.html', {"blast_output": blast_output})


# def search_result(request):
#     protein_name = request.POST['protein_name']
#     not_found = ""
#     try:
#         protein_obj = Protein.objects.get(unp_id=protein_name)
#         length = protein_obj.length
#         domain_num = protein_obj.domain_num
#         domain = protein_obj.domain
#         return render(request, 'search_result.html', {"protein_name": protein_name,
#         "length": length, "domain_num": domain_num, "domain": domain, "not_found":not_found})
#     except Protein.DoesNotExist:
#         not_found = "Not found"
#         return render(request, 'search_result.html', {"protein_name": protein_name,
#         "not_found":not_found})

def basic_search(request):
    return render(request, 'basic_search.html', {})


def organism(request):
    return render(request, 'organism.html', {})


# def homo_sapiens(request):
#     homo_sapiens_class = Protein_new.objects.filter(organism="homo sapiens")
#     num = len(homo_sapiens_class)
#     return render(request, 'organism_show.html', {"homo_sapiens_class": homo_sapiens_class, "num": num})


def organism_show(request, organism):
    organism = organism.split("_")[0]+" "+organism.split("_")[1]
    organism_ls = Protein_new.objects.filter(organism=organism)    # "homo sapiens"
    num = len(organism_ls)
    return render(request, 'organism_show.html', {"organism": organism, "organism_ls": organism_ls, "num": num})


def statistics(request):
    return render(request, "statistics.html", {})

def search_result(request):
    protein_name = request.POST['protein_name']
    not_found = ""
    try:
        protein_obj = Protein_new.objects.get(unp_id=protein_name)
        # length = protein_obj.length
        # domain_num = protein_obj.domain_num
        # domain = protein_obj.domain
        return render(request, 'search_result.html', {"protein_name": protein_name,
        "not_found":not_found})
    except Protein_new.DoesNotExist:
        not_found = "Not found"
        return render(request, 'search_result.html', {"protein_name": protein_name,
        "not_found":not_found})


def show(request, protein_name):
    protein_obj = Protein_new.objects.get(unp_id=protein_name)
    organism = protein_obj.organism
    length = protein_obj.length
    domain_num = protein_obj.domain_num
    domain = protein_obj.domain
    seq = protein_obj.seq
    return render(request, 'show.html', {"protein_name": protein_name, "organism": organism, "length": length, "domain_num": domain_num, "domain": domain, "seq": seq})
    # return HttpResponse(protein_name)


def annotation(request, protein_name):
    protein_obj = Protein_new.objects.get(unp_id=protein_name)
    organism = protein_obj.organism
    length = protein_obj.length
    domain_num = protein_obj.domain_num
    domain = protein_obj.domain
    seq = protein_obj.seq
    return render(request, 'annotation.html', {"protein_name": protein_name, "organism": organism, "length": length, "domain_num": domain_num, "domain": domain, "seq": seq})


def run_blast(request):
    import os
    import time
    from subprocess import PIPE, run
    work_dir = "/home/haolinz/work_space/django_project/django_0609/file/blast_database/tmp"
    seq = request.POST.get("seq")
    evalue = request.POST.get("evalue")
    # write seq to fasta
    query_fasta = "query_"+str(round(time.time()))+".fasta"
    with open(os.path.join(work_dir, query_fasta), "w") as f:
        # f.write(">query \n")
        f.write(seq)

    def out(command):
        result = run(command, stdout=PIPE, stderr=PIPE, universal_newlines=True, shell=True)
        return result.stdout

    command = "blastp -db /home/haolinz/work_space/django_project/django_0609/file/blast_database/sampleprot_db -query " + os.path.join(work_dir, query_fasta) + " -evalue "+evalue
    my_output = out(command)
    return my_output


def sarscov2(request):
    return render(request, 'sarscov2.html', {})