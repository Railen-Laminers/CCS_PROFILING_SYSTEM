<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * Authenticate a user by identifier (user_id or email) and password.
     * Returns the user and a plain-text Sanctum token.
     *
     * @throws ValidationException
     */
    public function login(string $identifier, string $password): array
    {
        $user = User::where('user_id', $identifier)
            ->orWhere('email', $identifier)
            ->first();

        if (!$user || !Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'identifier' => ['The provided credentials are invalid.'],
            ]);
        }

        $user->update(['last_login_at' => now()]);

        $token = $user->createToken('api-token')->plainTextToken;

        return [
            'user'  => $this->formatUserWithProfile($user),
            'token' => $token,
        ];
    }

    /**
     * Format user data including role-specific profile.
     */
    public function formatUserWithProfile(User $user): array
    {
        $data = $user->only([
            'id', 'firstname', 'middlename', 'lastname', 'user_id',
            'email', 'role', 'birth_date', 'contact_number', 'gender',
            'address', 'profile_picture', 'is_active',
        ]);

        if ($user->role === 'student') {
            $data['student'] = $user->student;
        } elseif ($user->role === 'faculty') {
            $data['faculty'] = $user->faculty;
        }

        return $data;
    }

    /**
     * Revoke the current access token.
     */
    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }
}
