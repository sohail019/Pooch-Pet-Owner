# 🐾 **User Journey Sample Responses**

## **📋 Overview**

This document provides sample responses for all user journey endpoints including packages, payments, and inventory items from the perspective of a pet owner.

---

## **📦 Package Management Journey**

### **1. Get All Packages**

```bash
GET /api/admin/packages
Authorization: Bearer ADMIN_TOKEN
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Basic Health Checkup Package",
      "description": "Comprehensive health checkup including vaccination, deworming, and basic tests",
      "price": 1500.0,
      "duration": 60,
      "features": [
        "Physical examination",
        "Vaccination",
        "Deworming",
        "Basic blood tests",
        "Health certificate"
      ],
      "status": "active",
      "createdBy": "550e8400-e29b-41d4-a716-446655440002",
      "createdByType": "admin",
      "clinicId": null,
      "isPopular": false,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "name": "Premium Grooming Package",
      "description": "Complete grooming service including bath, haircut, nail trimming, and ear cleaning",
      "price": 2500.0,
      "duration": 120,
      "features": [
        "Bath and shampoo",
        "Haircut and styling",
        "Nail trimming",
        "Ear cleaning",
        "Teeth brushing",
        "Flea treatment"
      ],
      "status": "active",
      "createdBy": "550e8400-e29b-41d4-a716-446655440004",
      "createdByType": "vet",
      "clinicId": "550e8400-e29b-41d4-a716-446655440005",
      "isPopular": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### **2. Get Package by ID**

```bash
GET /api/admin/packages/550e8400-e29b-41d4-a716-446655440001
Authorization: Bearer ADMIN_TOKEN
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Basic Health Checkup Package",
    "description": "Comprehensive health checkup including vaccination, deworming, and basic tests",
    "price": 1500.0,
    "duration": 60,
    "features": [
      "Physical examination",
      "Vaccination",
      "Deworming",
      "Basic blood tests",
      "Health certificate"
    ],
    "status": "active",
    "createdBy": "550e8400-e29b-41d4-a716-446655440002",
    "createdByType": "admin",
    "clinicId": null,
    "isPopular": false,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

### **3. Initiate Payment**

```bash
POST /api/payment/create
Authorization: Bearer USER_ACCESS_TOKEN
```

**Request Body:**

```json
{
  "packageId": "550e8400-e29b-41d4-a716-446655440001",
  "petId": "550e8400-e29b-41d4-a716-446655440006",
  "amount": 1500.0,
  "currency": "INR",
  "paymentMethod": "card",
  "gatewayOrderId": "order_123456789"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Payment initiated successfully",
  "data": {
    "paymentId": "550e8400-e29b-41d4-a716-446655440007",
    "packageId": "550e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440008",
    "petId": "550e8400-e29b-41d4-a716-446655440006",
    "amount": 1500.0,
    "currency": "INR",
    "paymentMethod": "card",
    "status": "pending",
    "gatewayOrderId": "order_123456789",
    "gatewayPaymentId": null,
    "gatewaySignature": null,
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

### **4. Complete Payment**

```bash
PATCH /api/payment/550e8400-e29b-41d4-a716-446655440007/status
Authorization: Bearer ADMIN_TOKEN
```

**Request Body:**

```json
{
  "paymentId": "550e8400-e29b-41d4-a716-446655440007",
  "gatewayPaymentId": "pay_123456789",
  "gatewaySignature": "abc123def456ghi789",
  "status": "completed"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Payment completed successfully",
  "data": {
    "paymentId": "550e8400-e29b-41d4-a716-446655440007",
    "packageId": "550e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440008",
    "petId": "550e8400-e29b-41d4-a716-446655440006",
    "amount": 1500.0,
    "currency": "INR",
    "paymentMethod": "card",
    "status": "completed",
    "gatewayOrderId": "order_123456789",
    "gatewayPaymentId": "pay_123456789",
    "gatewaySignature": "abc123def456ghi789",
    "completedAt": "2024-01-15T12:15:00.000Z",
    "userPackage": {
      "id": "550e8400-e29b-41d4-a716-446655440009",
      "packageId": "550e8400-e29b-41d4-a716-446655440001",
      "userId": "550e8400-e29b-41d4-a716-446655440008",
      "petId": "550e8400-e29b-41d4-a716-446655440006",
      "status": "active",
      "startDate": "2024-01-15T12:15:00.000Z",
      "endDate": "2024-03-15T12:15:00.000Z",
      "createdAt": "2024-01-15T12:15:00.000Z"
    }
  }
}
```

### **5. Get All User Packages**

```bash
GET /api/payment/user/packages
Authorization: Bearer USER_ACCESS_TOKEN
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440009",
      "packageId": "550e8400-e29b-41d4-a716-446655440001",
      "userId": "550e8400-e29b-41d4-a716-446655440008",
      "petId": "550e8400-e29b-41d4-a716-446655440006",
      "status": "active",
      "startDate": "2024-01-15T12:15:00.000Z",
      "endDate": "2024-03-15T12:15:00.000Z",
      "createdAt": "2024-01-15T12:15:00.000Z",
      "package": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Basic Health Checkup Package",
        "description": "Comprehensive health checkup including vaccination, deworming, and basic tests",
        "price": 1500.0,
        "duration": 60,
        "features": [
          "Physical examination",
          "Vaccination",
          "Deworming",
          "Basic blood tests",
          "Health certificate"
        ],
        "status": "active",
        "createdBy": "550e8400-e29b-41d4-a716-446655440002",
        "createdByType": "admin",
        "clinicId": null,
        "isPopular": false
      },
      "pet": {
        "id": "550e8400-e29b-41d4-a716-446655440006",
        "name": "Buddy",
        "species": "dog",
        "breed": "Golden Retriever",
        "age": 3
      }
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "packageId": "550e8400-e29b-41d4-a716-446655440003",
      "userId": "550e8400-e29b-41d4-a716-446655440008",
      "petId": "550e8400-e29b-41d4-a716-446655440011",
      "status": "expired",
      "startDate": "2023-11-01T10:00:00.000Z",
      "endDate": "2024-01-01T10:00:00.000Z",
      "createdAt": "2023-11-01T10:00:00.000Z",
      "package": {
        "id": "550e8400-e29b-41d4-a716-446655440003",
        "name": "Premium Grooming Package",
        "description": "Complete grooming service including bath, haircut, nail trimming, and ear cleaning",
        "price": 2500.0,
        "duration": 120,
        "features": [
          "Bath and shampoo",
          "Haircut and styling",
          "Nail trimming",
          "Ear cleaning",
          "Teeth brushing",
          "Flea treatment"
        ],
        "status": "active",
        "createdBy": "550e8400-e29b-41d4-a716-446655440004",
        "createdByType": "vet",
        "clinicId": "550e8400-e29b-41d4-a716-446655440005",
        "isPopular": true
      },
      "pet": {
        "id": "550e8400-e29b-41d4-a716-446655440011",
        "name": "Max",
        "species": "dog",
        "breed": "Labrador",
        "age": 5
      }
    }
  ]
}
```

---

## **🛒 Inventory Management Journey**

### **1. Get All Inventory Items**

```bash
GET /api/inventory
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440012",
      "name": "Premium Dog Food",
      "description": "High-quality dog food with balanced nutrition",
      "sku": "DOG-FOOD-001",
      "barcode": "1234567890123",
      "category": "Food",
      "subcategory": "Dog Food",
      "brand": "PetCare Plus",
      "price": 1200.0,
      "costPrice": 800.0,
      "quantity": 50,
      "minQuantity": 10,
      "maxQuantity": 100,
      "unit": "kg",
      "weight": 5.0,
      "dimensions": {
        "length": 30,
        "width": 20,
        "height": 10
      },
      "images": [
        "https://example.com/dog-food-1.jpg",
        "https://example.com/dog-food-2.jpg"
      ],
      "isActive": true,
      "isFeatured": true,
      "vendorId": "550e8400-e29b-41d4-a716-446655440013",
      "createdAt": "2024-01-15T09:00:00.000Z",
      "updatedAt": "2024-01-15T09:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440014",
      "name": "Cat Litter Box",
      "description": "Comfortable and easy-to-clean cat litter box",
      "sku": "CAT-LITTER-001",
      "barcode": "1234567890124",
      "category": "Accessories",
      "subcategory": "Cat Accessories",
      "brand": "CatComfort",
      "price": 800.0,
      "costPrice": 500.0,
      "quantity": 25,
      "minQuantity": 5,
      "maxQuantity": 50,
      "unit": "piece",
      "weight": 2.0,
      "dimensions": {
        "length": 40,
        "width": 30,
        "height": 15
      },
      "images": ["https://example.com/cat-litter-1.jpg"],
      "isActive": true,
      "isFeatured": false,
      "vendorId": "550e8400-e29b-41d4-a716-446655440015",
      "createdAt": "2024-01-15T09:30:00.000Z",
      "updatedAt": "2024-01-15T09:30:00.000Z"
    }
  ]
}
```

### **2. Get Inventory Item by ID**

```bash
GET /api/inventory/550e8400-e29b-41d4-a716-446655440012
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440012",
    "name": "Premium Dog Food",
    "description": "High-quality dog food with balanced nutrition",
    "sku": "DOG-FOOD-001",
    "barcode": "1234567890123",
    "category": "Food",
    "subcategory": "Dog Food",
    "brand": "PetCare Plus",
    "price": 1200.0,
    "costPrice": 800.0,
    "quantity": 50,
    "minQuantity": 10,
    "maxQuantity": 100,
    "unit": "kg",
    "weight": 5.0,
    "dimensions": {
      "length": 30,
      "width": 20,
      "height": 10
    },
    "images": [
      "https://example.com/dog-food-1.jpg",
      "https://example.com/dog-food-2.jpg"
    ],
    "isActive": true,
    "isFeatured": true,
    "vendorId": "550e8400-e29b-41d4-a716-446655440013",
    "vendor": {
      "id": "550e8400-e29b-41d4-a716-446655440013",
      "name": "PetCare Plus Store",
      "email": "info@petcareplus.com",
      "phone": "9876543210"
    },
    "createdAt": "2024-01-15T09:00:00.000Z",
    "updatedAt": "2024-01-15T09:00:00.000Z"
  }
}
```

### **3. Initiate Payment for Inventory Item**

```bash
POST /api/payment/create
Authorization: Bearer USER_ACCESS_TOKEN
```

**Request Body:**

```json
{
  "productId": "550e8400-e29b-41d4-a716-446655440012",
  "quantity": 2,
  "amount": 2400.0,
  "currency": "INR",
  "paymentMethod": "card",
  "gatewayOrderId": "order_987654321"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Payment initiated successfully",
  "data": {
    "paymentId": "550e8400-e29b-41d4-a716-446655440016",
    "productId": "550e8400-e29b-41d4-a716-446655440012",
    "userId": "550e8400-e29b-41d4-a716-446655440008",
    "quantity": 2,
    "amount": 2400.0,
    "currency": "INR",
    "paymentMethod": "card",
    "status": "pending",
    "gatewayOrderId": "order_987654321",
    "gatewayPaymentId": null,
    "gatewaySignature": null,
    "createdAt": "2024-01-15T13:00:00.000Z",
    "updatedAt": "2024-01-15T13:00:00.000Z"
  }
}
```

### **4. Complete Payment for Inventory Item**

```bash
PATCH /api/payment/550e8400-e29b-41d4-a716-446655440016/status
Authorization: Bearer ADMIN_TOKEN
```

**Request Body:**

```json
{
  "paymentId": "550e8400-e29b-41d4-a716-446655440016",
  "gatewayPaymentId": "pay_987654321",
  "gatewaySignature": "xyz789abc123def456",
  "status": "completed"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Payment completed successfully",
  "data": {
    "paymentId": "550e8400-e29b-41d4-a716-446655440016",
    "productId": "550e8400-e29b-41d4-a716-446655440012",
    "userId": "550e8400-e29b-41d4-a716-446655440008",
    "quantity": 2,
    "amount": 2400.0,
    "currency": "INR",
    "paymentMethod": "card",
    "status": "completed",
    "gatewayOrderId": "order_987654321",
    "gatewayPaymentId": "pay_987654321",
    "gatewaySignature": "xyz789abc123def456",
    "completedAt": "2024-01-15T13:15:00.000Z",
    "order": {
      "id": "550e8400-e29b-41d4-a716-446655440017",
      "productId": "550e8400-e29b-41d4-a716-446655440012",
      "userId": "550e8400-e29b-41d4-a716-446655440008",
      "quantity": 2,
      "status": "confirmed",
      "shippingAddress": {
        "street": "123 Pet Street",
        "city": "Mumbai",
        "state": "Maharashtra",
        "postalCode": "400001"
      },
      "createdAt": "2024-01-15T13:15:00.000Z"
    }
  }
}
```

### **5. Get All User Inventory Items (Orders)**

```bash
GET /api/payment/user/orders
Authorization: Bearer USER_ACCESS_TOKEN
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440017",
      "productId": "550e8400-e29b-41d4-a716-446655440012",
      "userId": "550e8400-e29b-41d4-a716-446655440008",
      "quantity": 2,
      "status": "confirmed",
      "shippingAddress": {
        "street": "123 Pet Street",
        "city": "Mumbai",
        "state": "Maharashtra",
        "postalCode": "400001"
      },
      "createdAt": "2024-01-15T13:15:00.000Z",
      "product": {
        "id": "550e8400-e29b-41d4-a716-446655440012",
        "name": "Premium Dog Food",
        "description": "High-quality dog food with balanced nutrition",
        "price": 1200.0,
        "images": ["https://example.com/dog-food-1.jpg"],
        "brand": "PetCare Plus"
      },
      "payment": {
        "id": "550e8400-e29b-41d4-a716-446655440016",
        "amount": 2400.0,
        "status": "completed",
        "paymentMethod": "card",
        "completedAt": "2024-01-15T13:15:00.000Z"
      }
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440018",
      "productId": "550e8400-e29b-41d4-a716-446655440014",
      "userId": "550e8400-e29b-41d4-a716-446655440008",
      "quantity": 1,
      "status": "delivered",
      "shippingAddress": {
        "street": "123 Pet Street",
        "city": "Mumbai",
        "state": "Maharashtra",
        "postalCode": "400001"
      },
      "createdAt": "2024-01-10T10:00:00.000Z",
      "deliveredAt": "2024-01-12T14:30:00.000Z",
      "product": {
        "id": "550e8400-e29b-41d4-a716-446655440014",
        "name": "Cat Litter Box",
        "description": "Comfortable and easy-to-clean cat litter box",
        "price": 800.0,
        "images": ["https://example.com/cat-litter-1.jpg"],
        "brand": "CatComfort"
      },
      "payment": {
        "id": "550e8400-e29b-41d4-a716-446655440019",
        "amount": 800.0,
        "status": "completed",
        "paymentMethod": "card",
        "completedAt": "2024-01-10T10:15:00.000Z"
      }
    }
  ]
}
```

---

## **🔍 Additional Endpoints**

### **Get Featured Products**

```bash
GET /api/inventory/featured
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440012",
      "name": "Premium Dog Food",
      "description": "High-quality dog food with balanced nutrition",
      "price": 1200.0,
      "images": ["https://example.com/dog-food-1.jpg"],
      "isFeatured": true,
      "brand": "PetCare Plus"
    }
  ]
}
```

### **Get Products by Category**

```bash
GET /api/inventory/category/Food
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440012",
      "name": "Premium Dog Food",
      "description": "High-quality dog food with balanced nutrition",
      "price": 1200.0,
      "category": "Food",
      "subcategory": "Dog Food",
      "images": ["https://example.com/dog-food-1.jpg"]
    }
  ]
}
```

### **Search Products**

```bash
GET /api/inventory/search/DOG-FOOD-001
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440012",
    "name": "Premium Dog Food",
    "description": "High-quality dog food with balanced nutrition",
    "sku": "DOG-FOOD-001",
    "barcode": "1234567890123",
    "price": 1200.0,
    "quantity": 50,
    "images": ["https://example.com/dog-food-1.jpg"]
  }
}
```

### **Get User Payment History**

```bash
GET /api/payment/user/payments
Authorization: Bearer USER_ACCESS_TOKEN
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440007",
      "packageId": "550e8400-e29b-41d4-a716-446655440001",
      "productId": null,
      "userId": "550e8400-e29b-41d4-a716-446655440008",
      "amount": 1500.0,
      "currency": "INR",
      "paymentMethod": "card",
      "status": "completed",
      "gatewayOrderId": "order_123456789",
      "gatewayPaymentId": "pay_123456789",
      "completedAt": "2024-01-15T12:15:00.000Z",
      "createdAt": "2024-01-15T12:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440016",
      "packageId": null,
      "productId": "550e8400-e29b-41d4-a716-446655440012",
      "userId": "550e8400-e29b-41d4-a716-446655440008",
      "amount": 2400.0,
      "currency": "INR",
      "paymentMethod": "card",
      "status": "completed",
      "gatewayOrderId": "order_987654321",
      "gatewayPaymentId": "pay_987654321",
      "completedAt": "2024-01-15T13:15:00.000Z",
      "createdAt": "2024-01-15T13:00:00.000Z"
    }
  ]
}
```

---

## **⚠️ Missing Endpoints**

Based on the current API structure, the following endpoints are **NOT IMPLEMENTED** and would need to be created:

### **Package Management:**

- ❌ **Public package listing** - Currently packages are only accessible via admin routes
- ❌ **User package purchase flow** - Need user-specific package endpoints

### **Inventory Management:**

- ❌ **User order management** - Need user-specific order endpoints
- ❌ **Shopping cart functionality** - Not implemented
- ❌ **Order tracking** - Not implemented

### **Payment Management:**

- ❌ **User-specific payment endpoints** - Some payment endpoints are admin-only
- ❌ **Payment failure handling** - Only success scenarios documented

---

## **🎯 Recommendations**

### **1. Create Public Package Endpoints:**

```bash
GET /api/packages - Get all public packages
GET /api/packages/:id - Get package by ID (public)
```

### **2. Create User Order Management:**

```bash
GET /api/user/orders - Get user orders
POST /api/user/orders - Create user order
GET /api/user/orders/:id - Get order by ID
```

### **3. Create Shopping Cart:**

```bash
POST /api/cart/add - Add item to cart
GET /api/cart - Get cart items
DELETE /api/cart/:id - Remove item from cart
POST /api/cart/checkout - Checkout cart
```

### **4. Enhance Payment Flow:**

```bash
POST /api/payment/fail - Handle payment failure
GET /api/payment/:id/status - Get payment status
```

---

## **📝 Notes**

1. **Authentication**: All protected endpoints require `Authorization: Bearer TOKEN`
2. **Role-based Access**: Different endpoints have different role requirements
3. **Error Handling**: All endpoints return consistent error formats
4. **Pagination**: List endpoints support pagination with `limit` and `offset`
5. **Filtering**: Many endpoints support various filter parameters
6. **Associations**: Responses include related data where applicable

This documentation provides a complete overview of the user journey endpoints currently available in the API! 🎉
