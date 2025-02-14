from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse

#Importe requests y json
import requests
import json

from collections import Counter

# Importe el decorador login_required
from django.contrib.auth.decorators import login_required, permission_required

# Restricción de acceso con @login_required
@login_required
@permission_required('main.index_viewer', raise_exception=True)
def index(request):
    # Arme el endpoint del REST API
    current_url = request.build_absolute_uri()
    url = current_url + '/api/v1/landing'

    # Petición al REST API
    response_http = requests.get(url)
    response_dict = json.loads(response_http.content)

    print("Endpoint ", url)
    print("Response ", response_dict)

    # Respuestas totales
    total_responses = len(response_dict.keys())

    #Primera y última respuesta
    responses = list(response_dict.values())
    if responses:
        first_response = responses[0].get('saved')
        last_response = responses[-1].get('saved')
    else:
        first_response = None
        last_response = None

    #Días con más respuestas
    dates = [
        response.get('saved').split(',')[0]  # Extract only the date part
        for response in responses if response.get('saved')
    ]

    if dates:
        date_counts = Counter(dates)
        most_common_date, most_common_count = date_counts.most_common(1)[0]
    else:
        most_common_date = None
        most_common_count = 0

    # Valores de la respuesta
    responses = response_dict.values()

    # Objeto con los datos a renderizar
    data = {
        'title': 'ReadyMeals - Dashboard',
        'total_responses': total_responses,
        'responses': responses,
        'first_response': first_response,
        'last_response': last_response,
        'most_common_date': most_common_date,
        'most_common_count': most_common_count
    }

    # Renderización en la plantilla
    return render(request, 'main/index.html', data)