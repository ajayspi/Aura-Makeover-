# AuroMakeover — Database Architecture

This document outlines the Entity-Relationship Diagram (ERD) for the expanded AuroMakeover SaaS Platform.

## Full Platform ERD

```mermaid
erDiagram
    %% Core Entities
    USER {
        string id PK
        string role "CUSTOMER, ADMIN, TECH, VENDOR"
        string phone
        string name
    }

    LEAD {
        string id PK
        string status "NEW, VAN_DISPATCHED, QUOTED, WON, LOST"
        string city
        string society
        string assignedAgentId FK
    }

    %% Order & Commerce
    ORDER {
        string id PK
        string customerId FK
        string status "DEPOSIT, FABRICATION, INSTALL_READY, COMPLETE"
        float totalValue
    }

    ORDER_ITEM {
        string id PK
        string orderId FK
        string designItemId FK
        string dyeLotId FK
        float squareFeet
    }

    ESCROW_TRANSACTION {
        string id PK
        string orderId FK
        string stage "DEPOSIT_10, MATERIAL_60, QA_30"
        string status "PENDING, PAID, REFUNDED"
    }

    %% Inventory & Logistics
    DESIGN_ITEM {
        string id PK
        string sku
        string category "WALLPAPER, LOUVER, BLIND"
        float pricePerSqFt
    }

    DYE_LOT {
        string id PK
        string designItemId FK
        string batchNumber
        float metersAvailable
    }

    %% Fulfillment
    INSTALLATION {
        string id PK
        string orderId FK
        string technicianId FK
        string vanId FK
        datetime scheduledAt
        string status "SCHEDULED, IN_PROGRESS, QA_PENDING, COMPLETED"
    }

    QA_REPORT {
        string id PK
        string installationId FK
        float moistureReading
        boolean customerSigned
        string warrantyStatus
    }

    VAN {
        string id PK
        string vehicleNumber
        string status
    }

    %% Relationships
    USER ||--o{ LEAD : "manages (if Agent)"
    USER ||--o{ ORDER : "places (if Customer)"
    
    LEAD ||--o| ORDER : "converts to"
    
    ORDER ||--|{ ORDER_ITEM : "contains"
    ORDER ||--o{ ESCROW_TRANSACTION : "tracks payment via"
    ORDER ||--o| INSTALLATION : "requires"

    DESIGN_ITEM ||--o{ DYE_LOT : "manufactured in"
    DYE_LOT ||--o{ ORDER_ITEM : "allocated to"
    
    USER ||--o{ INSTALLATION : "performs (if Tech)"
    VAN ||--o{ INSTALLATION : "assigned to"
    
    INSTALLATION ||--o| QA_REPORT : "generates"
```

## Key Architectural Decisions

1. **Escrow Data Model (`ESCROW_TRANSACTION`)**: Instead of a single payment record, payments are strictly divided into three tranches (10% Deposit, 60% Material, 30% QA). This enforces the AuroMakeover brand promise at the database level.
2. **Dye Lot Tracking (`DYE_LOT`)**: Wallpapers require exact batch matching to prevent color variations. The schema ensures that an `ORDER_ITEM` is bound to a specific `DYE_LOT`, not just a generic `DESIGN_ITEM`.
3. **QA Immutability (`QA_REPORT`)**: Installations cannot be marked complete without a corresponding `QA_REPORT` containing moisture readings and sign-offs. This directly triggers the 30% escrow release.
