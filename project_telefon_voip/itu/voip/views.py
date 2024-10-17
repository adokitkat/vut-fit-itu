from django.shortcuts import render
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.http import JsonResponse
from .models import User, Contact, Profile
from django.shortcuts import get_object_or_404
from django.db.models import Q

# vracia vyplneny HTML template a caka na ajax requesty, podla ktorych spravuje logiku
def index(request):

    url_parameter = request.GET.get("q")
    add1 = request.GET.get("a")
    add2 = request.GET.get("b")

    if add1:
        person_check1 = Contact.objects.get(name=add1)
        if person_check1:
            if add2:
                person_check2 = Contact.objects.get(surname=add2)
                if person_check2:
                    person_check1.added = True
                    person_check1.save()
            else:
                person_check1.added = True
                person_check1.save()
    
    user = User.objects.all()[0]

    if url_parameter:
        people = Profile.objects.filter(Q(name__icontains=url_parameter) | Q(surname__icontains=url_parameter)).distinct()
    else:
        people = Contact.objects.filter(added=True)

    ctx = {"people": people, "user": user}
    if request.is_ajax():

        html = render_to_string(
            template_name="voip/result.html", context={"people": people, "user": user}
        )
        data_dict = {"html_from_view": html}
        return JsonResponse(data=data_dict, safe=False)

    return render(request, "voip/index.html", context=ctx)

