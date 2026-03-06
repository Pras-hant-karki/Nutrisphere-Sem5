"use server";
import { login, register, requestPasswordReset, resetPassword } from "@/lib/api/auth"
import { LoginData, RegisterData } from "@/app/(auth)/schema"
import { setAuthToken, setUserData, clearAuthCookies } from "../cookie"
import { redirect } from "next/navigation";
export const handleRegister = async (data: RegisterData) => {
    try {
        const response = await register(data)
        if (response.success) {
            await setAuthToken(response.token)
            await setUserData(response.data)
            return {
                success: true,
                message: 'Registration successful',
                data: response.data,
                token: response.token
            }
        }
        return {
            success: false,
            message: response.message || 'Registration failed'
        }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Registration action failed' }
    }
}

export const handleLogin = async (data: LoginData) => {
    try {
        const response = await login(data)
        if (response.success) {
            await setAuthToken(response.token)
            await setUserData(response.user)
            return {
                success: true,
                message: 'Login successful',
                data: response.user,
                token: response.token
            }
        }
        return {
            success: false,
            message: response.message || 'Login failed'
        }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Login action failed' }
    }
}

export const handleLogout = async () => {
    await clearAuthCookies();
    return redirect('/login');
}

export const handleRequestPasswordReset = async (email: string) => {
    try {
        const response = await requestPasswordReset(email)
        return {
            success: !!response.success,
            message: response.message || 'If this email exists, a reset link has been sent.'
        }
    } catch (error: Error | any) {
        return {
            success: false,
            message: error.message || 'Failed to request password reset'
        }
    }
}

export const handleResetPassword = async (token: string, password: string) => {
    try {
        const response = await resetPassword(token, password)
        return {
            success: !!response.success,
            message: response.message || 'Password reset successfully'
        }
    } catch (error: Error | any) {
        return {
            success: false,
            message: error.message || 'Failed to reset password'
        }
    }
}