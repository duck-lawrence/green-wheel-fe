import { DamageStatus, VehicleChecklistType } from "@/constants/enum"
import { VehicleChecklistViewRes } from "@/models/checklist/schema/response"

// ✅ MOCK DATA VINFAST CHECKLIST
export const mockVehicleChecklists: VehicleChecklistViewRes[] = [
    {
        id: "CHK001",
        type: VehicleChecklistType.Handover,
        isSignedByStaff: true,
        isSignedByCustomer: false,
        staff: {
            id: "ST001",
            firstName: "Nguyen",
            lastName: "Van A",
            email: "vana@greenwheel.vn",
            phone: "0901234567",
            needSetPassword: false,
            role: { id: "R001", name: "Staff" },
            station: { id: "S001", name: "Trạm VinFast Quận 7" }
        },
        customer: {
            id: "CUS001",
            firstName: "Tran",
            lastName: "Thi B",
            email: "tranb@gmail.com",
            phone: "0987654321",
            needSetPassword: false
        },
        vehicle: {
            id: "VF001",
            licensePlate: "51H-88888",
            stationId: "S001",
            model: {
                id: "MD001",
                name: "VinFast VF e34",
                brand: { id: "BR001", name: "VinFast" },
                segment: "SUV điện",
                seatCount: 5,
                transmission: "Tự động",
                fuelType: "Điện",
                year: 2023
            }
        },
        contractId: "CON001",
        vehicleChecklistItems: [
            {
                id: "ITEM001",
                notes: "Không trầy xước, tình trạng bình tốt.",
                status: DamageStatus.Good,
                imageUrl: "/images/checklist/front_view_vfe34.jpg",
                component: {
                    id: "COMP001",
                    name: "Ngoại thất - đầu xe",
                    description: "Kiểm tra đèn, nắp capo, cản trước."
                }
            },
            {
                id: "ITEM002",
                notes: "Kính chiếu hậu bên phải hơi trầy nhẹ.",
                status: DamageStatus.Minor,
                imageUrl: "/images/checklist/mirror_right.jpg",
                component: {
                    id: "COMP002",
                    name: "Kính chiếu hậu",
                    description: "Hai bên kính chiếu hậu."
                }
            },
            {
                id: "ITEM003",
                notes: "Bánh sau phải non hơi.",
                status: DamageStatus.Moderate,
                imageUrl: "/images/checklist/tire_rear_right.jpg",
                component: {
                    id: "COMP003",
                    name: "Lốp xe",
                    description: "Kiểm tra độ mòn và áp suất lốp."
                }
            }
        ]
    },
    {
        id: "CHK002",
        type: VehicleChecklistType.Return,
        isSignedByStaff: true,
        isSignedByCustomer: true,
        staff: {
            id: "ST002",
            firstName: "Le",
            lastName: "Minh Cuong",
            email: "cuonglm@greenwheel.vn",
            phone: "0905554321",
            needSetPassword: false,
            role: { id: "R001", name: "Staff" },
            station: { id: "S002", name: "Trạm VinFast Hà Đông" }
        },
        customer: {
            id: "CUS002",
            firstName: "Pham",
            lastName: "Gia Huy",
            email: "pgiahuy@gmail.com",
            phone: "0977999888",
            needSetPassword: false
        },
        vehicle: {
            id: "VF002",
            licensePlate: "30G-12345",
            stationId: "S002",
            model: {
                id: "MD002",
                name: "VinFast Lux A2.0",
                brand: { id: "BR001", name: "VinFast" },
                segment: "Sedan",
                seatCount: 5,
                transmission: "Tự động 8 cấp",
                fuelType: "Xăng",
                year: 2022
            }
        },
        contractId: "CON002",
        vehicleChecklistItems: [
            {
                id: "ITEM004",
                notes: "Thân xe trầy nhẹ bên hông trái.",
                status: DamageStatus.Minor,
                imageUrl: "/images/checklist/left_side.jpg",
                component: {
                    id: "COMP004",
                    name: "Thân xe",
                    description: "Hai bên cửa và vè xe."
                }
            },
            {
                id: "ITEM005",
                notes: "Đèn pha trái mờ, cần vệ sinh.",
                status: DamageStatus.Minor,
                imageUrl: "/images/checklist/headlight_left.jpg",
                component: {
                    id: "COMP005",
                    name: "Đèn pha",
                    description: "Đèn chiếu sáng trước."
                }
            },
            {
                id: "ITEM006",
                notes: "Bánh trước bên phải bị mòn lốp nhiều.",
                status: DamageStatus.Severe,
                imageUrl: "/images/checklist/front_tire_right.jpg",
                component: {
                    id: "COMP006",
                    name: "Lốp xe",
                    description: "Bánh trước và sau, độ mòn."
                }
            }
        ]
    },
    {
        id: "CHK003",
        type: VehicleChecklistType.OutOfContract,
        isSignedByStaff: false,
        isSignedByCustomer: false,
        staff: {
            id: "ST003",
            firstName: "Bui",
            lastName: "Thanh Lam",
            email: "lam.bt@greenwheel.vn",
            phone: "0902333444",
            needSetPassword: false,
            role: { id: "R002", name: "Technician" },
            station: { id: "S003", name: "Trạm VinFast Biên Hòa" }
        },
        vehicle: {
            id: "VF003",
            licensePlate: "60A-66666",
            stationId: "S003",
            model: {
                id: "MD003",
                name: "VinFast VF 8",
                brand: { id: "BR001", name: "VinFast" },
                segment: "SUV điện",
                seatCount: 7,
                transmission: "Tự động",
                fuelType: "Điện",
                year: 2024
            }
        },
        vehicleChecklistItems: [
            {
                id: "ITEM007",
                notes: "Bình điện đầy đủ, hệ thống sạc hoạt động tốt.",
                status: DamageStatus.Good,
                imageUrl: "/images/checklist/charging_port.jpg",
                component: {
                    id: "COMP007",
                    name: "Hệ thống điện",
                    description: "Cổng sạc và hệ thống điện áp cao."
                }
            },
            {
                id: "ITEM008",
                notes: "Nội thất sạch sẽ, ghế da nguyên vẹn.",
                status: DamageStatus.Good,
                imageUrl: "/images/checklist/interior_vf8.jpg",
                component: {
                    id: "COMP008",
                    name: "Nội thất",
                    description: "Ghế, taplo, vô lăng, điều hòa."
                }
            }
        ]
    }
]
