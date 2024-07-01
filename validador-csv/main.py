import pandas as pd
import re
from datetime import datetime

def validate_csv(file_path, output_path):
    df = pd.read_csv(file_path)
    invalid_data = []

    def is_valid_email(email):
        regex = r'^\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        return re.match(regex, email)

    def is_valid_uuid(uuid):
        regex = r'^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
        return re.match(regex, uuid)

    def is_valid_date(date_string):
        try:
            datetime.strptime(date_string, '%Y-%m-%d')
            return True
        except ValueError:
            return False

    for index, row in df.iterrows():
        error = None

        # if not row['name'] or not re.match(r'^[A-Za-z ]+$', row['name']):
        #     error = "Invalid name"
        if not isinstance(row['governmentId'], int):
            error = "Invalid governmentId"
        elif not row['email'] or not is_valid_email(row['email']):
            error = "Invalid email"
        elif not isinstance(row['debtAmount'], int) or row['debtAmount'] <= 0:
            error = "Invalid debtAmount"
        elif not row['debtDueDate'] or not is_valid_date(row['debtDueDate']):
            error = "Invalid debtDueDate"
        elif not row['debtId'] or not is_valid_uuid(row['debtId']):
            error = "Invalid debtId"

        if error:
            invalid_data.append(row.tolist() + [error])

    if invalid_data:
        invalid_df = pd.DataFrame(invalid_data, columns=df.columns.tolist() + ['error'])
        invalid_df.to_csv(output_path, index=False)
    else:
        print("No invalid data found.")

# Use the function with your CSV file
validate_csv('../data/input.csv', 'invalid_data.csv')
