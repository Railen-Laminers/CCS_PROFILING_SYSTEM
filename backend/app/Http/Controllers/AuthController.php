<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string',
            'password' => 'required|string|min:6',
        ]);

        $user = User::where('user_id', $request->identifier)
            ->orWhere('email', $request->identifier)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'identifier' => ['The provided credentials are invalid.'],
            ]);
        }

        $user->update(['last_login_at' => now()]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $this->formatUserWithProfile($user),
            'token' => $token,
        ], 200);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'user' => $this->formatUserWithProfile($user),
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout successful'], 200);
    }

    /**
     * Format user data including role-specific profile.
     */
    private function formatUserWithProfile(User $user)
    {
        $data = $user->only([
            'id',
            'firstname',
            'middlename',
            'lastname',
            'user_id',
            'email',
            'role',
            'birth_date',
            'contact_number',
            'gender',
            'address',
            'profile_picture',
            'is_active'
        ]);

        if ($user->role === 'student') {
            $data['student'] = $user->student;
        } elseif ($user->role === 'faculty') {
            $data['faculty'] = $user->faculty;
        }

        return $data;
    }
}