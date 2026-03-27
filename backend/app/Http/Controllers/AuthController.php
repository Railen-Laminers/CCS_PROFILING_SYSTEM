<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        private readonly AuthService $authService
    ) {}

    public function login(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string',
            'password'   => 'required|string|min:6',
        ]);

        $result = $this->authService->login($request->identifier, $request->password);

        return response()->json([
            'message' => 'Login successful',
            'user'    => $result['user'],
            'token'   => $result['token'],
        ], 200);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $this->authService->formatUserWithProfile($request->user()),
        ], 200);
    }

    public function logout(Request $request)
    {
        $this->authService->logout($request->user());

        return response()->json(['message' => 'Logout successful'], 200);
    }
}