import { signAccessToken } from "../lib/jwt";
import { Role } from "@/lib/generated/prisma";

// Manually set secrets if not in environment
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "RotanaAdminAccessSecretKey123!@#";
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "RotanaAdminRefreshSecretKey123!@#";


async function test() {
  const token = signAccessToken({
    userId: "437e3a4b-ab92-4e72-b3a3-5f8a560142c0",
    email: "admin@rotana.com",
    role: Role.SUPER_ADMIN
  });

  const baseUrl = "http://localhost:3000/api";
  const headers = { Authorization: `Bearer ${token}` };

  console.log("Testing Payroll & Analytics Endpoints...");

  try {
    // 1. Test Payslips GET
    const payslipsRes = await fetch(`${baseUrl}/payroll/payslips`, { headers });
    const payslips = await payslipsRes.json();
    console.log("✅ GET /payroll/payslips:", payslips.data.length, "items found");

    // 2. Test Commissions GET
    const commissionsRes = await fetch(`${baseUrl}/payroll/commissions`, { headers });
    const commissions = await commissionsRes.json();
    console.log("✅ GET /payroll/commissions:", commissions.data.length, "items found");

    // 3. Test Employee Analytics
    const empAnalyticsRes = await fetch(`${baseUrl}/analytics/employees`, { headers });
    const empAnalytics = await empAnalyticsRes.json();
    console.log("✅ GET /analytics/employees:", empAnalytics.data.performance.length, "staff members found");

    // 4. Test Supplier Analytics
    const supAnalyticsRes = await fetch(`${baseUrl}/analytics/suppliers`, { headers });
    const supAnalytics = await supAnalyticsRes.json();
    console.log("✅ GET /analytics/suppliers:", supAnalytics.data.performance.length, "suppliers found");

  } catch (error) {
    console.error("❌ Test failed:", (error as Error).message);
  }
}

test();
