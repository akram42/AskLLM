from datetime import datetime, timedelta

import requests

BASE_URL = 'https://api.openai.com'
api_key = ''


def request(url):
    headers = {'Authorization': f'Bearer {api_key}'}
    response = requests.get(BASE_URL + url, headers=headers)
    return response.json()


def get_usage(start=None, end=None):
    if start is None:
        start = (datetime.today() - timedelta(days=30)).strftime("%Y-%m-%d")
    if end is None:
        end = datetime.today().strftime("%Y-%m-%d")

    usage = request(f'/dashboard/billing/usage?start_date={start}&end_date={end}')
    return usage
