# Shopify Backend Challenge 2022
The purpose of this challenge was to build out the backend of an inventory tracking application for a logistics company. The challenge requirements are documented at https://docs.google.com/document/d/1z9LZ_kZBUbg-O2MhZVVSqTmvDko5IJWHtuFmIu_Xg1A/edit. My application is accessible at:
### https://shopify-backend-2022.herokuapp.com/

## Running the application
To make evaluating the application simpler, the server is hosted on Heroku and can be accessed over the web at the URL specified above. No installations or packages
are required for the evaluators. I utilized Postman to send requests to the application's API endpoints (described in detail below). The application can also be accessed via HTTP requests using the 'curl' command from the terminal of your machine. Because I used Postman, this documentation is tailored accordingly.

## API Documentation
Before getting into the details of the API, it is important to mention that the extra feature I have chosen to implement is the 'ability to create warehouses/locations and assign inventory to specific locations'. The corresponding API for this feature are also listed below.

| Endpoint | HTTP verb | Description |
| --- | --- | --- |
| /inventory/items/:itemId? | GET | Retrieve all items currently stored in the inventory. If optional parameter 'itemId' provided, retrieve that specific item |
| /inventory/items/:itemId | DELETE | Delete inventory item with specified itemId, if exists |
| /inventory/items/:itemId | PUT | Edit inventory item with specified itemId. If not exists, create the inventory item |
| /inventory/items | POST | Create inventory item |
| /warehouses/:warehouseId? | GET | Retrieve all existing warehouses. If optional parameter 'warehouseId' provided, retrieve all inventory assigned to that warehouse |
| /warehouses | POST | Create a new warehouse |

### NOTE
There are 2 data objects being used in my application: an item and a warehouse. The JSON structure of the objects required in API requests looks like the following:

item object:
```javascript
{ "name": ,
  "stock": ,
  "description": ,
  "warehouseId":
}
```
ADDITIONAL FEATURE FUNCTIONALITY: providing a 'warehouseId' for an item object is optional. If provided, the backend code will check if it is a valid existing warehouse before assigning item to that warehouse. If warehouseId not provided in request body by client, item will be assigned to the Main Warehouse located in Vancouver,Canada by default

warehouse object:
```javascript
{ "name": ,
  "location": 
}
```

## API Testing examples
Below I have attached some examples of API usage for my backend application. Using the same Req body data I have shown below will result in responses with appropriate error codes (I have designed my application to reject creating duplicate warehouses and adding duplicated invenotry items)

### Ex: Create a new Warehouse (additional feature)
POST `https://shopify-backend-2022.herokuapp.com/warehouses`

Req body:
```javascript
{ 
  "name": "Warehouse API Test",
  "location": "Montreal, Canada"
}
```
Response:
status code: 201 created
```javascript
{
  "id": 3,
  "name": "Warehouse API Test",
  "location": "Montreal, Canada"
}
```
### Ex: Retrieve All Warehouses (additional feature)
GET `https://shopify-backend-2022.herokuapp.com/warehouses`

Response:
status code: 200 OK
```javascript
[
    {
        "id": 1,
        "name": "MainWarehouse",
        "location": "Vancouver, Canada"
    },
    {
        "id": 2,
        "name": "Warehouse2",
        "location": "Toronto, Canada"
    },
    {
        "id": 3,
        "name": "Warehouse API Test",
        "location": "Montreal, Canada"
    }
]
```





