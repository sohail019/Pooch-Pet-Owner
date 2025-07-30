# 💳 **Payment Module - Sample Inputs & API Testing Guide**

## **📋 Overview**

This document provides comprehensive sample inputs for testing all payment module endpoints, including package payments, product payments, user management, and admin operations.

---

## **🔗 Payment Creation Samples**

### **📦 Package Payment**

#### **1. Create Package Payment**

```bash
POST /api/payment/create
Authorization: Bearer USER_TOKEN
Content-Type: application/json
```

**Sample Input:**

```json
{
  "packageId": "550e8400-e29b-41d4-a716-446655440001",
  "amount": 1500.0,
  "currency": "INR",
  "method": "upi",
  "transactionId": "TXN123456789",
  "gatewayResponse": {
    "gateway": "razorpay",
    "orderId": "order_123456",
    "paymentId": "pay_789012"
  }
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440005",
    "userId": "550e8400-e29b-41d4-a716-446655440004",
    "paymentType": "package",
    "packageId": "550e8400-e29b-41d4-a716-446655440001",
    "amount": 1500.0,
    "currency": "INR",
    "status": "pending",
    "method": "upi",
    "transactionId": "TXN123456789",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### **🛍️ Product Payment**

#### **2. Create Product Payment**

```bash
POST /api/payment/create
Authorization: Bearer USER_TOKEN
Content-Type: application/json
```

**Sample Input:**

```json
{
  "productId": "550e8400-e29b-41d4-a716-446655440002",
  "quantity": 3,
  "amount": 750.0,
  "currency": "INR",
  "method": "credit_card",
  "deliveryAddress": "123 Main Street, Mumbai, Maharashtra - 400001",
  "transactionId": "TXN987654321",
  "gatewayResponse": {
    "gateway": "stripe",
    "paymentIntentId": "pi_123456789",
    "chargeId": "ch_987654321"
  }
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440006",
    "userId": "550e8400-e29b-41d4-a716-446655440004",
    "paymentType": "product",
    "productId": "550e8400-e29b-41d4-a716-446655440002",
    "quantity": 3,
    "amount": 750.0,
    "currency": "INR",
    "status": "pending",
    "method": "credit_card",
    "transactionId": "TXN987654321",
    "createdAt": "2024-01-15T10:35:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

---

## **🎯 Payment Webhook Samples**

### **3. Payment Webhook (Success)**

```bash
POST /api/payment/webhook
Content-Type: application/json
```

**Sample Input:**

```json
{
  "paymentId": "550e8400-e29b-41d4-a716-446655440005",
  "status": "completed",
  "transactionId": "TXN123456789",
  "gatewayResponse": {
    "gateway": "razorpay",
    "orderId": "order_123456",
    "paymentId": "pay_789012",
    "signature": "abc123def456"
  },
  "failureReason": null
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Payment webhook processed successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440005",
    "status": "completed",
    "transactionId": "TXN123456789",
    "updatedAt": "2024-01-15T10:40:00.000Z"
  }
}
```

### **4. Payment Webhook (Failed)**

```bash
POST /api/payment/webhook
Content-Type: application/json
```

**Sample Input:**

```json
{
  "paymentId": "550e8400-e29b-41d4-a716-446655440007",
  "status": "failed",
  "transactionId": "TXN111222333",
  "gatewayResponse": {
    "gateway": "razorpay",
    "errorCode": "PAYMENT_DECLINED",
    "errorMessage": "Insufficient funds"
  },
  "failureReason": "Insufficient funds in account"
}
```

---

## **👤 User Payment Management**

### **5. Get User Payments**

```bash
GET /api/payment/user/payments?page=1&limit=5
Authorization: Bearer USER_TOKEN
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440005",
        "paymentType": "package",
        "amount": 1500.0,
        "currency": "INR",
        "status": "completed",
        "method": "upi",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "package": {
          "id": "550e8400-e29b-41d4-a716-446655440001",
          "name": "Premium Health Package",
          "description": "Comprehensive health checkup",
          "price": 1500.0
        }
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440006",
        "paymentType": "product",
        "amount": 750.0,
        "currency": "INR",
        "status": "completed",
        "method": "credit_card",
        "createdAt": "2024-01-15T10:35:00.000Z",
        "product": {
          "id": "550e8400-e29b-41d4-a716-446655440002",
          "name": "Premium Dog Food",
          "description": "High-quality dog food",
          "price": 250.0
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 2,
      "totalPages": 1
    }
  }
}
```

### **6. Get User Packages**

```bash
GET /api/payment/user/packages?page=1&limit=5
Authorization: Bearer USER_TOKEN
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "userPackages": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440008",
        "userId": "550e8400-e29b-41d4-a716-446655440004",
        "packageId": "550e8400-e29b-41d4-a716-446655440001",
        "paymentId": "550e8400-e29b-41d4-a716-446655440005",
        "status": "active",
        "startDate": "2024-01-15T10:30:00.000Z",
        "endDate": "2024-03-15T10:30:00.000Z",
        "featuresUsed": [],
        "createdAt": "2024-01-15T10:40:00.000Z",
        "package": {
          "id": "550e8400-e29b-41d4-a716-446655440001",
          "name": "Premium Health Package",
          "description": "Comprehensive health checkup",
          "price": 1500.0
        },
        "payment": {
          "id": "550e8400-e29b-41d4-a716-446655440005",
          "amount": 1500.0,
          "status": "completed",
          "method": "upi"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### **7. Get User Products**

```bash
GET /api/payment/user/products?page=1&limit=5
Authorization: Bearer USER_TOKEN
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "userProducts": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440009",
        "userId": "550e8400-e29b-41d4-a716-446655440004",
        "productId": "550e8400-e29b-41d4-a716-446655440002",
        "paymentId": "550e8400-e29b-41d4-a716-446655440006",
        "quantity": 3,
        "unitPrice": 250.0,
        "totalPrice": 750.0,
        "status": "purchased",
        "deliveryAddress": "123 Main Street, Mumbai, Maharashtra - 400001",
        "deliveryDate": null,
        "notes": null,
        "createdAt": "2024-01-15T10:40:00.000Z",
        "product": {
          "id": "550e8400-e29b-41d4-a716-446655440002",
          "name": "Premium Dog Food",
          "description": "High-quality dog food",
          "price": 250.0
        },
        "payment": {
          "id": "550e8400-e29b-41d4-a716-446655440006",
          "amount": 750.0,
          "status": "completed",
          "method": "credit_card"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### **8. Get Active User Package**

```bash
GET /api/payment/user/active-package
Authorization: Bearer USER_TOKEN
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440008",
    "userId": "550e8400-e29b-41d4-a716-446655440004",
    "packageId": "550e8400-e29b-41d4-a716-446655440001",
    "paymentId": "550e8400-e29b-41d4-a716-446655440005",
    "status": "active",
    "startDate": "2024-01-15T10:30:00.000Z",
    "endDate": "2024-03-15T10:30:00.000Z",
    "featuresUsed": [],
    "createdAt": "2024-01-15T10:40:00.000Z",
    "package": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Premium Health Package",
      "description": "Comprehensive health checkup",
      "price": 1500.0
    },
    "payment": {
      "id": "550e8400-e29b-41d4-a716-446655440005",
      "amount": 1500.0,
      "status": "completed",
      "method": "upi"
    }
  }
}
```

---

## **👨‍💼 Admin Payment Management**

### **9. Get All Payments (Admin)**

```bash
GET /api/payment/admin/payments?page=1&limit=10&paymentType=package&status=completed
Authorization: Bearer ADMIN_TOKEN
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440005",
        "userId": "550e8400-e29b-41d4-a716-446655440004",
        "paymentType": "package",
        "packageId": "550e8400-e29b-41d4-a716-446655440001",
        "amount": 1500.0,
        "currency": "INR",
        "status": "completed",
        "method": "upi",
        "transactionId": "TXN123456789",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "user": {
          "id": "550e8400-e29b-41d4-a716-446655440004",
          "name": "John Smith",
          "email": "john.smith@email.com"
        },
        "package": {
          "id": "550e8400-e29b-41d4-a716-446655440001",
          "name": "Premium Health Package",
          "description": "Comprehensive health checkup",
          "price": 1500.0
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### **10. Get All User Packages (Admin)**

```bash
GET /api/payment/admin/user-packages?page=1&limit=10&status=active
Authorization: Bearer ADMIN_TOKEN
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "userPackages": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440008",
        "userId": "550e8400-e29b-41d4-a716-446655440004",
        "packageId": "550e8400-e29b-41d4-a716-446655440001",
        "paymentId": "550e8400-e29b-41d4-a716-446655440005",
        "status": "active",
        "startDate": "2024-01-15T10:30:00.000Z",
        "endDate": "2024-03-15T10:30:00.000Z",
        "featuresUsed": [],
        "createdAt": "2024-01-15T10:40:00.000Z",
        "user": {
          "id": "550e8400-e29b-41d4-a716-446655440004",
          "name": "John Smith",
          "email": "john.smith@email.com"
        },
        "package": {
          "id": "550e8400-e29b-41d4-a716-446655440001",
          "name": "Premium Health Package",
          "description": "Comprehensive health checkup",
          "price": 1500.0
        },
        "payment": {
          "id": "550e8400-e29b-41d4-a716-446655440005",
          "amount": 1500.0,
          "status": "completed",
          "method": "upi"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### **11. Get All User Products (Admin)**

```bash
GET /api/payment/admin/user-products?page=1&limit=10&status=purchased
Authorization: Bearer ADMIN_TOKEN
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "userProducts": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440009",
        "userId": "550e8400-e29b-41d4-a716-446655440004",
        "productId": "550e8400-e29b-41d4-a716-446655440002",
        "paymentId": "550e8400-e29b-41d4-a716-446655440006",
        "quantity": 3,
        "unitPrice": 250.0,
        "totalPrice": 750.0,
        "status": "purchased",
        "deliveryAddress": "123 Main Street, Mumbai, Maharashtra - 400001",
        "deliveryDate": null,
        "notes": null,
        "createdAt": "2024-01-15T10:40:00.000Z",
        "user": {
          "id": "550e8400-e29b-41d4-a716-446655440004",
          "name": "John Smith",
          "email": "john.smith@email.com"
        },
        "product": {
          "id": "550e8400-e29b-41d4-a716-446655440002",
          "name": "Premium Dog Food",
          "description": "High-quality dog food",
          "price": 250.0
        },
        "payment": {
          "id": "550e8400-e29b-41d4-a716-446655440006",
          "amount": 750.0,
          "status": "completed",
          "method": "credit_card"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### **12. Get Payment Statistics (Admin)**

```bash
GET /api/payment/admin/statistics
Authorization: Bearer ADMIN_TOKEN
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "totalPayments": 150,
    "completedPayments": 120,
    "pendingPayments": 20,
    "failedPayments": 10,
    "totalRevenue": 75000.0,
    "packagePayments": 80,
    "productPayments": 70
  }
}
```

---

## **🔧 Payment Management Operations**

### **13. Update Payment Status (Admin)**

```bash
PATCH /api/payment/550e8400-e29b-41d4-a716-446655440005/status
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

**Sample Input:**

```json
{
  "status": "completed",
  "failureReason": null,
  "gatewayResponse": {
    "gateway": "razorpay",
    "orderId": "order_123456",
    "paymentId": "pay_789012"
  }
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Payment status updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440005",
    "status": "completed",
    "updatedAt": "2024-01-15T10:45:00.000Z"
  }
}
```

### **14. Refund Payment (Admin)**

```bash
POST /api/payment/550e8400-e29b-41d4-a716-446655440005/refund
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

**Sample Input:**

```json
{
  "refundAmount": 1500.0,
  "refundReason": "Customer requested cancellation"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Payment refunded successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440005",
    "status": "refunded",
    "refundAmount": 1500.0,
    "refundReason": "Customer requested cancellation",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

## **📦 User Package Management**

### **15. Create User Package (Admin)**

```bash
POST /api/payment/user-packages
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

**Sample Input:**

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440004",
  "packageId": "550e8400-e29b-41d4-a716-446655440001",
  "paymentId": "550e8400-e29b-41d4-a716-446655440005",
  "startDate": "2024-01-15T10:30:00.000Z",
  "endDate": "2024-03-15T10:30:00.000Z",
  "featuresUsed": []
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "User package created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440008",
    "userId": "550e8400-e29b-41d4-a716-446655440004",
    "packageId": "550e8400-e29b-41d4-a716-446655440001",
    "paymentId": "550e8400-e29b-41d4-a716-446655440005",
    "status": "active",
    "startDate": "2024-01-15T10:30:00.000Z",
    "endDate": "2024-03-15T10:30:00.000Z",
    "featuresUsed": [],
    "createdAt": "2024-01-15T10:50:00.000Z"
  }
}
```

### **16. Update User Package Status (Admin)**

```bash
PATCH /api/payment/user-packages/550e8400-e29b-41d4-a716-446655440008/status
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

**Sample Input:**

```json
{
  "status": "cancelled",
  "featuresUsed": ["health_checkup", "vaccination"]
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "User package status updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440008",
    "status": "cancelled",
    "featuresUsed": ["health_checkup", "vaccination"],
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

## **🛍️ User Product Management**

### **17. Create User Product (Admin)**

```bash
POST /api/payment/user-products
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

**Sample Input:**

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440004",
  "productId": "550e8400-e29b-41d4-a716-446655440002",
  "paymentId": "550e8400-e29b-41d4-a716-446655440006",
  "quantity": 3,
  "unitPrice": 250.0,
  "totalPrice": 750.0,
  "deliveryAddress": "123 Main Street, Mumbai, Maharashtra - 400001",
  "notes": "Express delivery requested"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "User product created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440009",
    "userId": "550e8400-e29b-41d4-a716-446655440004",
    "productId": "550e8400-e29b-41d4-a716-446655440002",
    "paymentId": "550e8400-e29b-41d4-a716-446655440006",
    "quantity": 3,
    "unitPrice": 250.0,
    "totalPrice": 750.0,
    "status": "purchased",
    "deliveryAddress": "123 Main Street, Mumbai, Maharashtra - 400001",
    "notes": "Express delivery requested",
    "createdAt": "2024-01-15T10:55:00.000Z"
  }
}
```

### **18. Update User Product Status (Admin)**

```bash
PATCH /api/payment/user-products/550e8400-e29b-41d4-a716-446655440009/status
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

**Sample Input:**

```json
{
  "status": "delivered",
  "deliveryDate": "2024-01-16T14:00:00.000Z",
  "notes": "Delivered successfully to customer"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "User product status updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440009",
    "status": "delivered",
    "deliveryDate": "2024-01-16T14:00:00.000Z",
    "notes": "Delivered successfully to customer",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

## **🎯 Complete Payment Journey Examples**

### **📦 Package Payment Journey**

#### **Step 1: Create Package Payment**

```bash
curl -X POST "http://localhost:4000/api/payment/create" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_TOKEN" \
  -d '{
    "packageId": "550e8400-e29b-41d4-a716-446655440001",
    "amount": 1500.00,
    "currency": "INR",
    "method": "upi"
  }'
```

#### **Step 2: Process Payment Webhook**

```bash
curl -X POST "http://localhost:4000/api/payment/webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "550e8400-e29b-41d4-a716-446655440005",
    "status": "completed",
    "transactionId": "TXN123456789",
    "gatewayResponse": {
      "gateway": "razorpay",
      "orderId": "order_123456",
      "paymentId": "pay_789012"
    }
  }'
```

#### **Step 3: Check User Package**

```bash
curl -X GET "http://localhost:4000/api/payment/user/active-package" \
  -H "Authorization: Bearer USER_TOKEN"
```

### **🛍️ Product Payment Journey**

#### **Step 1: Create Product Payment**

```bash
curl -X POST "http://localhost:4000/api/payment/create" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_TOKEN" \
  -d '{
    "productId": "550e8400-e29b-41d4-a716-446655440002",
    "quantity": 2,
    "amount": 500.00,
    "currency": "INR",
    "method": "credit_card",
    "deliveryAddress": "123 Main Street, Mumbai"
  }'
```

#### **Step 2: Process Payment Webhook**

```bash
curl -X POST "http://localhost:4000/api/payment/webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "550e8400-e29b-41d4-a716-446655440006",
    "status": "completed",
    "transactionId": "TXN987654321",
    "gatewayResponse": {
      "gateway": "stripe",
      "paymentIntentId": "pi_123456789"
    }
  }'
```

#### **Step 3: Check User Products**

```bash
curl -X GET "http://localhost:4000/api/payment/user/products" \
  -H "Authorization: Bearer USER_TOKEN"
```

#### **Step 4: Update Delivery Status (Admin)**

```bash
curl -X PATCH "http://localhost:4000/api/payment/user-products/550e8400-e29b-41d4-a716-446655440009/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "status": "delivered",
    "deliveryDate": "2024-01-16T14:00:00.000Z",
    "notes": "Delivered successfully"
  }'
```

---

## **🎯 Testing Checklist**

### **✅ Package Payment Testing:**

- [ ] Create package payment
- [ ] Process payment webhook (success)
- [ ] Process payment webhook (failure)
- [ ] Check user packages
- [ ] Check active package
- [ ] Update payment status
- [ ] Refund payment

### **✅ Product Payment Testing:**

- [ ] Create product payment
- [ ] Process payment webhook (success)
- [ ] Process payment webhook (failure)
- [ ] Check user products
- [ ] Update delivery status
- [ ] Check stock reduction

### **✅ Admin Management Testing:**

- [ ] Get all payments
- [ ] Get all user packages
- [ ] Get all user products
- [ ] Get payment statistics
- [ ] Create user package
- [ ] Create user product
- [ ] Update package status
- [ ] Update product status

### **✅ Error Handling Testing:**

- [ ] Invalid payment ID
- [ ] Insufficient stock
- [ ] Invalid payment method
- [ ] Invalid payment status
- [ ] Missing required fields
- [ ] Unauthorized access

---

## **🎉 Summary**

### **📋 Sample Data IDs:**

- **User ID**: `550e8400-e29b-41d4-a716-446655440004`
- **Package ID**: `550e8400-e29b-41d4-a716-446655440001`
- **Product ID**: `550e8400-e29b-41d4-a716-446655440002`
- **Payment IDs**: `550e8400-e29b-41d4-a716-446655440005`, `550e8400-e29b-41d4-a716-446655440006`
- **User Package ID**: `550e8400-e29b-41d4-a716-446655440008`
- **User Product ID**: `550e8400-e29b-41d4-a716-446655440009`

### **🔧 Testing Tools:**

- **Postman Collection**: Import these requests
- **cURL Commands**: Use the provided curl examples
- **Frontend Integration**: Use the sample inputs in your frontend

### **🎯 Key Features Tested:**

- ✅ Package payment creation and processing
- ✅ Product payment creation and processing
- ✅ Webhook handling for both payment types
- ✅ User package and product management
- ✅ Admin payment management
- ✅ Delivery status tracking
- ✅ Payment statistics and analytics

**Complete payment module testing guide ready!** 💳✨
