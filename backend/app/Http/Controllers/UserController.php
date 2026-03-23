<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * Display a listing of all users.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $users = User::select('id', 'firstname', 'middlename', 'lastname', 'user_id', 'email', 'role')
            ->get();

        return response()->json(['users' => $users], 200);
    }

    /**
     * Display a single user by ID or user_id.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $user = User::select('id', 'firstname', 'middlename', 'lastname', 'user_id', 'email', 'role')
            ->where('id', $id)
            ->orWhere('user_id', $id)
            ->firstOrFail();

        return response()->json(['user' => $user], 200);
    }

    /**
     * Create a new user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'firstname' => 'required|string|max:255',
            'middlename' => 'nullable|string|max:255',
            'lastname' => 'required|string|max:255',
            'user_id' => 'required|string|size:7|unique:users,user_id',
            'email' => 'required|email|unique:users,email',
            'password' => [
                'required',
                Password::min(8)->mixedCase()->numbers(),
            ],
            'role' => 'required|in:faculty,student',
        ]);

        $user = User::create([
            'firstname' => $request->firstname,
            'middlename' => $request->middlename,
            'lastname' => $request->lastname,
            'user_id' => $request->user_id,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user->only(['id', 'firstname', 'middlename', 'lastname', 'user_id', 'email', 'role']),
        ], 201);
    }

    /**
     * Update an existing user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $rules = [
            'firstname' => 'sometimes|string|max:255',
            'middlename' => 'nullable|string|max:255',
            'lastname' => 'sometimes|string|max:255',
            'user_id' => 'sometimes|string|size:7|unique:users,user_id,' . $user->id,
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => [
                'sometimes',
                Password::min(8)->mixedCase()->numbers(),
            ],
            'role' => 'sometimes|in:faculty,student',
        ];

        $request->validate($rules);

        $data = $request->only(['firstname', 'middlename', 'lastname', 'user_id', 'email', 'role']);
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user->only(['id', 'firstname', 'middlename', 'lastname', 'user_id', 'email', 'role']),
        ], 200);
    }

    /**
     * Delete a user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Prevent admin from deleting themselves
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'You cannot delete your own account.'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully'], 200);
    }

    /**
     * Get all students.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStudents()
    {
        $students = User::select('id', 'firstname', 'middlename', 'lastname', 'user_id', 'email')
            ->where('role', 'student')
            ->get();

        return response()->json(['students' => $students], 200);
    }

    /**
     * Get all faculty.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFaculty()
    {
        $faculty = User::select('id', 'firstname', 'middlename', 'lastname', 'user_id', 'email')
            ->where('role', 'faculty')
            ->get();

        return response()->json(['faculty' => $faculty], 200);
    }
}