<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Services\AuthService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        private readonly AuthService $authService
    ) {}

    /**
     * Login with identifier (user_id or email) and password.
     */
    public function login(LoginRequest $request)
    {
        $result = $this->authService->login($request->identifier, $request->password);

        return response()->json([
            'message' => 'Login successful',
            'user'    => $result['user'],
            'token'   => $result['token'],
        ], 200);
    }

    /**
     * Get the authenticated user's profile.
     */
    public function me(Request $request)
    {
        return response()->json([
            'user' => $this->authService->formatUserWithProfile($request->user()),
        ], 200);
    }

    /**
     * Logout the authenticated user.
     */
    public function logout(Request $request)
    {
        $this->authService->logout($request->user());

        return response()->json(['message' => 'Logout successful'], 200);
    }
}