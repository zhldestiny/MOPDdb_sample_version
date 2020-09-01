from django.urls import path
from . import views
urlpatterns = [
    path('', views.home, name="home"),
    path('search_result/', views.search_result, name="search_result"),
    path('basic_search', views.basic_search, name="basic_search"),
    path('blast/', views.blast, name="blast"),
    path('blast/do_blast', views.do_blast, name="do_blast"),
    path('classification/organism', views.organism, name="organism"),
    path('classification/organism/<organism>', views.organism_show, name="organism_show"),
    path('statistics/', views.statistics, name="statistics"),
    path('<str:protein_name>', views.show, name="show"),    # 内容页
    path('<str:protein_name>/annotations', views.annotation, name="show"),    # 注释页
    path('sarscov2/', views.sarscov2, name="sarscov2"),    # SARSCoV2专题
]