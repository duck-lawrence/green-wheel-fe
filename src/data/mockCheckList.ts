import { VehicleChecklistType, DamageStatus } from "@/constants/enum"
import { VehicleChecklistViewRes } from "@/models/checklist/schema/response"

export const mockVehicleChecklists: VehicleChecklistViewRes[] = [
    {
        id: "CHK001",
        type: VehicleChecklistType.Handover,
        isSignedByStaff: true,
        isSignedByCustomer: false,
        staffId: "STF001",
        customerId: "CUS001",
        vehicleId: "VF-A2001",
        contractId: "CON001",
        vehicleChecklistItems: [
            {
                id: "ITM001",
                notes: "Thân xe không trầy xước",
                status: DamageStatus.Good,
                imageUrl: "",
                component: {
                    id: "COMP001",
                    name: "Thân xe",
                    description: "Kiểm tra lớp sơn, vỏ xe và cửa xe"
                }
            },
            {
                id: "ITM002",
                notes: "Kính chắn gió có vết nứt nhỏ",
                status: DamageStatus.Minor,
                imageUrl: "",
                component: {
                    id: "COMP002",
                    name: "Kính chắn gió",
                    description: "Quan sát nứt hoặc mờ kính"
                }
            },
            {
                id: "ITM003",
                notes: "Lốp xe trước mòn 30%",
                status: DamageStatus.Moderate,
                imageUrl: "",
                component: {
                    id: "COMP003",
                    name: "Lốp xe",
                    description: "Đo độ mòn và áp suất"
                }
            }
        ]
    },
    {
        id: "CHK002",
        type: VehicleChecklistType.Return,
        isSignedByStaff: false,
        isSignedByCustomer: true,
        staffId: "STF002",
        customerId: "CUS002",
        vehicleId: "VF-SA2002",
        contractId: "CON002",
        vehicleChecklistItems: [
            {
                id: "ITM004",
                notes: "Đèn pha bị mờ nhẹ",
                status: DamageStatus.Minor,
                imageUrl: "",
                component: {
                    id: "COMP004",
                    name: "Đèn pha",
                    description: "Kiểm tra độ sáng và tình trạng bề mặt"
                }
            },
            {
                id: "ITM005",
                notes: "Nội thất sạch, không mùi lạ",
                status: DamageStatus.Good,
                imageUrl: "",
                component: {
                    id: "COMP005",
                    name: "Nội thất",
                    description: "Ghế, taplo, thảm, vô-lăng"
                }
            }
        ]
    },
    {
        id: "CHK003",
        type: VehicleChecklistType.OutOfContract,
        isSignedByStaff: true,
        isSignedByCustomer: true,
        staffId: "STF003",
        vehicleId: "VF-E3401",
        vehicleChecklistItems: [
            {
                id: "ITM006",
                notes: "Bumper trước hư nặng sau va chạm",
                status: DamageStatus.Severe,
                imageUrl: "",
                component: {
                    id: "COMP006",
                    name: "Cản trước",
                    description: "Phần nhựa phía trước xe"
                }
            },
            {
                id: "ITM007",
                notes: "Đèn hậu bên trái vỡ hoàn toàn",
                status: DamageStatus.Totaled,
                imageUrl: "",
                component: {
                    id: "COMP007",
                    name: "Đèn hậu",
                    description: "Kiểm tra cụm đèn phía sau"
                }
            }
        ]
    }
]
