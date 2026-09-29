# AuroMakeover — UML Use Case Diagrams

This document outlines the core interactions between the platform's primary actors (Customer, Operations Admin, Technician, Vendor) and the system.

## 1. Customer Flow
The Customer interacts with the public-facing marketing site, the estimator, and the authenticated customer portal (`/my`).

```mermaid
flowchart LR
    %% Actor
    Cust([Customer])

    %% Use Cases
    subgraph Public Site
        TakeQuiz(Take AI Style Quiz)
        GetEstimate(Get Instant Estimate)
        BookVan(Book Swatch Van)
    end
    
    subgraph Customer Portal
        TrackOrder(Track Order Status)
        PayEscrow(Pay 10/60/30 Escrow)
        ViewPhotos(View Installation Photos)
        ClaimWarranty(File 2-Year Warranty Claim)
    end

    %% Relationships
    Cust --> TakeQuiz
    Cust --> GetEstimate
    Cust --> BookVan
    Cust --> TrackOrder
    Cust --> PayEscrow
    Cust --> ViewPhotos
    Cust --> ClaimWarranty
```

## 2. Operations Admin Flow
The Ops Admin (or City Manager) uses the internal Ops Dashboard (`/ops`) to manage the entire business lifecycle.

```mermaid
flowchart LR
    %% Actor
    Admin([Ops Admin])

    %% Use Cases
    subgraph CRM & Sales
        ManageLeads(Manage Leads Kanban)
        AssignAgent(Assign Sales Agent)
        ConvertQuote(Convert Lead to Order)
    end

    subgraph Operations & Fulfillment
        DispatchVan(Dispatch Swatch Van)
        ManageInventory(Manage Warehouse Stock)
        GeneratePO(Generate Vendor PO)
        ReleaseMaterial(Trigger 60% Material Escrow)
        ScheduleInstall(Schedule Installation Calendar)
    end

    %% Relationships
    Admin --> ManageLeads
    Admin --> AssignAgent
    Admin --> ConvertQuote
    Admin --> DispatchVan
    Admin --> ManageInventory
    Admin --> GeneratePO
    Admin --> ReleaseMaterial
    Admin --> ScheduleInstall
```

## 3. Technician Flow
The Technician uses the mobile-optimized Tech Workspace (`/tech`) on-site at the customer's flat.

```mermaid
flowchart LR
    %% Actor
    Tech([Technician])

    %% Use Cases
    subgraph Tech Workspace
        ViewSchedule(View Daily Install Schedule)
        ScanMaterial(Scan Dye-Lot QR Code)
        CheckMoisture(Record Wall Moisture % )
        UploadQA(Upload Seam/QA Photos)
        ActivateWarranty(Trigger 30% Final Escrow & Warranty)
    end

    %% Relationships
    Tech --> ViewSchedule
    Tech --> ScanMaterial
    Tech --> CheckMoisture
    Tech --> UploadQA
    Tech --> ActivateWarranty
```

## 4. Vendor Flow
The Vendor uses the Vendor Portal (`/vendor`) to receive print orders and manage catalog items.

```mermaid
flowchart LR
    %% Actor
    Vendor([Vendor / Printer])

    %% Use Cases
    subgraph Vendor Portal
        ReceivePO(Receive Print Order / Cut-Sheet)
        UpdateStatus(Update Production Status)
        ShipMaterial(Mark Material as Shipped)
        ManageCatalog(Upload New Wallpaper Designs)
    end

    %% Relationships
    Vendor --> ReceivePO
    Vendor --> UpdateStatus
    Vendor --> ShipMaterial
    Vendor --> ManageCatalog
```
