from django import template

register = template.Library()

@register.filter()
def carculate(value):
    """Removes all values of arg from the given string"""

    print("============================TAGS========")
    print(value)
    print("====================================")
    arg = "test"

    return value