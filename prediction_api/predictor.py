import pandas as pd
from prophet import Prophet
from sklearn.metrics import mean_absolute_error,mean_squared_error
import numpy as np
import matplotlib.pyplot as plt

def get_next_day_predictions():

    #load the dataset
    df = pd.read_csv('food_sales_last_3_months.csv')
    df['date'] = pd.to_datetime(df['date'])

    grouped = df.groupby(['date', 'food_name'])['quantity_sold'].sum().reset_index()

    grouped['promotion'] = grouped['date'].dt.dayofweek.apply(lambda x:1 if x == 4 else 0)

    grouped['is_weekend'] = grouped['date'].dt.dayofweek.apply(lambda x:1 if x >= 5 else 0)

    predictions = []

    for food in grouped['food_name'].unique():
        food_df = grouped[grouped['food_name'] == food].copy()
        food_df = food_df.rename(columns={'date': 'ds', 'quantity_sold': 'y'})
        food_df = food_df.sort_values('ds')

        #Prepare prophet model
        model = Prophet()
        model.add_regressor('promotion')
        model.add_regressor('is_weekend')
        model.fit(food_df)


        #Prepare the next day input
        tomorrow = food_df['ds'].max() +pd.Timedelta(days=1)
        tomorrow_df = pd.DataFrame({
            'ds':[tomorrow],
            'promotion':[1 if tomorrow.weekday() == 4 else 0],
            'is_weekend':[1 if tomorrow.weekday() >= 5 else 0]
        })

        forecast = model.predict(tomorrow_df)
        next_day_prediction = forecast[['ds','yhat']].iloc[0]

        predictions.append({
            'food_name' : food,
            'predicted_quantity':int(round(next_day_prediction['yhat']))
        })


    return predictions
