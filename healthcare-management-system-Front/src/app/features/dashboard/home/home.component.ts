import { Component } from "@angular/core"
import { RouterLink } from "@angular/router"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-home",
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: "./home.component.html",
})
export class HomeComponent {
  features = [
    {
      title: "Patient Management",
      description: "Efficiently manage patient records, appointments, and medical history.",
      icon: "user-plus",
    },
    {
      title: "Doctor Scheduling",
      description: "Optimize doctor schedules and availability for better patient care.",
      icon: "calendar",
    },
    {
      title: "Medical Records",
      description: "Secure storage and easy access to patient medical records and test results.",
      icon: "clipboard",
    },
    {
      title: "Billing & Insurance",
      description: "Streamlined billing process and insurance claim management.",
      icon: "credit-card",
    },
  ]
}

