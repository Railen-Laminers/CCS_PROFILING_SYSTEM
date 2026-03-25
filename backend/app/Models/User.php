<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'firstname',
        'middlename',
        'lastname',
        'user_id',
        'email',
        'password',
        'role',
        'birth_date',
        'contact_number',
        'gender',
        'address',
        'profile_picture',
        'is_active',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
        'last_login_at' => 'datetime',
        'birth_date' => 'date',
    ];

    public function student()
    {
        return $this->hasOne(Student::class);
    }

    public function faculty()
    {
        return $this->hasOne(Faculty::class);
    }
}