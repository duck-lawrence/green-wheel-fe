import {
    DepositStatus,
    InvoiceItemType,
    InvoiceStatus,
    InvoiceType,
    PaymentMethod,
    RentalContractStatus
} from "@/constants/enum"
import { RentalContractViewRes } from "@/models/rental-contract/schema/response"

export const mockContracts: RentalContractViewRes[] = [
    {
        id: "CON001",
        description: "Thuê xe VinFast VF e34 phục vụ công tác 3 ngày tại Hà Nội",
        notes: "Khách hàng yêu cầu giao xe tận nơi tại khách sạn Marriott",
        startDate: "2025-10-01T08:00:00+07:00",
        actualStartDate: "2025-10-01T08:25:00+07:00",
        endDate: "2025-10-04T08:00:00+07:00",
        actualEndDate: "2025-10-04T07:45:00+07:00",
        status: RentalContractStatus.Completed,
        customerId: "CUS001",
        station: {
            id: "ST01",
            name: "Trạm VinFast Hà Nội Center",
            address: "Số 8 Phạm Hùng, Nam Từ Liêm, Hà Nội"
        },
        handoverStaffId: "STF001",
        returnStaffId: "STF002",
        vehicle: {
            id: "VH001",
            licensePlate: "30G-123.45",
            stationId: "ST01",
            model: {
                id: "MD001",
                name: "VinFast VF e34",
                description: "SUV điện đô thị tầm trung, pin 42kWh, tầm di chuyển 318km",
                costPerDay: 950000,
                depositFee: 2000000,
                seatingCapacity: 5,
                numberOfAirbags: 6,
                motorPower: 110,
                batteryCapacity: 42,
                ecoRangeKm: 318,
                sportRangeKm: 285,
                imageUrl: "/images/vfe34_main.jpg",
                imageUrls: [
                    "/images/vfe34_front.jpg",
                    "/images/vfe34_side.jpg",
                    "/images/vfe34_interior.jpg"
                ],
                brand: {
                    id: "BR001",
                    name: "VinFast",
                    description: "Hãng xe điện Việt Nam thuộc tập đoàn Vingroup",
                    country: "Vietnam",
                    foundedYear: 2017
                },
                segment: {
                    id: "SEG001",
                    name: "SUV Crossover",
                    description: "Xe gầm cao 5 chỗ, tiện nghi phù hợp đô thị"
                },
                availableVehicleCount: 12
            }
        },
        invoices: [
            {
                id: "INV001-A",
                type: InvoiceType.Reservation,
                subtotal: 2850000,
                tax: 285000,
                total: 3135000,
                payAmount: 3135000,
                paymentMentod: PaymentMethod.MomoWallet,
                notes: "Thanh toán tiền thuê xe trước 100%",
                status: InvoiceStatus.Paid,
                paidAt: "2025-09-30T20:15:00+07:00",
                invoiceItems: [
                    {
                        id: "IT001",
                        quantity: 3,
                        unitPrice: 950000,
                        subTotal: 2850000,
                        type: InvoiceItemType.BaseRental
                    }
                ],
                deposit: {
                    id: "DEP001",
                    amount: 2000000,
                    refundedAt: "2025-10-04T09:00:00+07:00",
                    status: DepositStatus.Refunded
                }
            },
            {
                id: "INV001-B",
                type: InvoiceType.Return,
                subtotal: 300000,
                tax: 30000,
                total: 330000,
                payAmount: 330000,
                paymentMentod: PaymentMethod.Cash,
                notes: "Phí vệ sinh xe và thay nước rửa kính",
                status: InvoiceStatus.Paid,
                paidAt: "2025-10-04T09:10:00+07:00",
                invoiceItems: [
                    {
                        id: "IT002",
                        quantity: 1,
                        unitPrice: 200000,
                        subTotal: 200000,
                        type: InvoiceItemType.Cleaning
                    },
                    {
                        id: "IT003",
                        quantity: 1,
                        unitPrice: 100000,
                        subTotal: 100000,
                        type: InvoiceItemType.Other
                    }
                ]
            }
        ]
    },
    {
        id: "CON002",
        description: "Thuê xe VinFast VF 8 đi du lịch Đà Lạt 5 ngày",
        startDate: "2025-09-25T07:00:00+07:00",
        endDate: "2025-09-30T07:00:00+07:00",
        status: RentalContractStatus.Completed,
        customerId: "CUS002",
        station: {
            id: "ST02",
            name: "Trạm VinFast Sài Gòn Quận 7",
            address: "120 Nguyễn Văn Linh, Quận 7, TP.HCM"
        },
        handoverStaffId: "STF005",
        returnStaffId: "STF007",
        vehicle: {
            id: "VH002",
            licensePlate: "51H-678.99",
            stationId: "ST02",
            model: {
                id: "MD002",
                name: "VinFast VF 8 Plus",
                description: "SUV hạng D 5 chỗ, công suất 300kW, tầm pin 471km",
                costPerDay: 1500000,
                depositFee: 3000000,
                seatingCapacity: 5,
                numberOfAirbags: 8,
                motorPower: 300,
                batteryCapacity: 87.7,
                ecoRangeKm: 471,
                sportRangeKm: 400,
                imageUrl: "/images/vf8_main.jpg",
                imageUrls: [
                    "/images/vf8_front.jpg",
                    "/images/vf8_side.jpg",
                    "/images/vf8_interior.jpg"
                ],
                brand: {
                    id: "BR001",
                    name: "VinFast",
                    description: "Hãng xe điện Việt Nam thuộc tập đoàn Vingroup",
                    country: "Vietnam",
                    foundedYear: 2017
                },
                segment: {
                    id: "SEG002",
                    name: "SUV Hạng D",
                    description: "Xe gầm cao cỡ trung cao cấp, nội thất sang trọng"
                },
                availableVehicleCount: 8
            }
        },
        invoices: [
            {
                id: "INV002-A",
                type: InvoiceType.Reservation,
                subtotal: 7500000,
                tax: 750000,
                total: 8250000,
                payAmount: 8250000,
                paymentMentod: PaymentMethod.MomoWallet,
                notes: "Thanh toán tiền thuê xe trước khi nhận",
                status: InvoiceStatus.Paid,
                paidAt: "2025-09-24T21:00:00+07:00",
                invoiceItems: [
                    {
                        id: "IT010",
                        quantity: 5,
                        unitPrice: 1500000,
                        subTotal: 7500000,
                        type: InvoiceItemType.BaseRental
                    }
                ],
                deposit: {
                    id: "DEP002",
                    amount: 3000000,
                    status: DepositStatus.Refunded,
                    refundedAt: "2025-09-30T12:00:00+07:00"
                }
            },
            {
                id: "INV002-B",
                type: InvoiceType.Return,
                subtotal: 1200000,
                tax: 120000,
                total: 1320000,
                payAmount: 1320000,
                paymentMentod: PaymentMethod.Cash,
                notes: "Khách gây trầy sơn nhẹ ở cản sau",
                status: InvoiceStatus.Paid,
                paidAt: "2025-09-30T11:30:00+07:00",
                invoiceItems: [
                    {
                        id: "IT011",
                        quantity: 1,
                        unitPrice: 1200000,
                        subTotal: 1200000,
                        type: InvoiceItemType.Damage
                    }
                ]
            }
        ]
    },
    {
        id: "CON003",
        description: "Thuê xe VinFast VF 5 để chạy dịch vụ GrabCar 7 ngày",
        startDate: "2025-10-05T09:00:00+07:00",
        endDate: "2025-10-12T09:00:00+07:00",
        status: RentalContractStatus.Active,
        customerId: "CUS003",
        station: {
            id: "ST03",
            name: "Trạm VinFast Thủ Đức",
            address: "25 Võ Văn Ngân, TP.Thủ Đức, TP.HCM"
        },
        vehicle: {
            id: "VH003",
            licensePlate: "51K-456.22",
            stationId: "ST03",
            model: {
                id: "MD003",
                name: "VinFast VF 5 Plus",
                description: "Crossover cỡ nhỏ, tiết kiệm năng lượng, pin 37,23kWh",
                costPerDay: 800000,
                depositFee: 1500000,
                seatingCapacity: 5,
                numberOfAirbags: 6,
                motorPower: 100,
                batteryCapacity: 37.23,
                ecoRangeKm: 300,
                sportRangeKm: 270,
                imageUrl: "/images/vf5_main.jpg",
                imageUrls: [
                    "/images/vf5_front.jpg",
                    "/images/vf5_side.jpg",
                    "/images/vf5_interior.jpg"
                ],
                brand: {
                    id: "BR001",
                    name: "VinFast",
                    description: "Hãng xe điện Việt Nam thuộc tập đoàn Vingroup",
                    country: "Vietnam",
                    foundedYear: 2017
                },
                segment: {
                    id: "SEG003",
                    name: "Crossover cỡ nhỏ",
                    description: "Xe 5 chỗ đô thị nhỏ gọn, phù hợp di chuyển trong thành phố"
                },
                availableVehicleCount: 15
            }
        },
        invoices: [
            {
                id: "INV003-A",
                type: InvoiceType.Reservation,
                subtotal: 5600000,
                tax: 560000,
                total: 6160000,
                payAmount: 6160000,
                paymentMentod: PaymentMethod.MomoWallet,
                notes: "Khách đặt xe trả trước",
                status: InvoiceStatus.Paid,
                paidAt: "2025-10-04T22:15:00+07:00",
                invoiceItems: [
                    {
                        id: "IT020",
                        quantity: 7,
                        unitPrice: 800000,
                        subTotal: 5600000,
                        type: InvoiceItemType.BaseRental
                    }
                ],
                deposit: {
                    id: "DEP003",
                    amount: 1500000,
                    status: DepositStatus.Paid
                }
            }
        ]
    }
]
