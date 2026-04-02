<?php
namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

// #[ApiResource]
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasRoles, HasFactory, Notifiable, HasApiTokens;

    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'is_student',
        'avatar_url',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        // 'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            // 'email_verified_at' => 'datetime',
            // 'password' => 'hashed',
        ];
    }

    public function student()
    {
        return $this->hasOne(Student::class, 'user_id');
    }

    public function faculty()
    {
        return $this->hasOne(Faculty::class, 'user_id');
    }

    public function projects()
    {
        return $this->hasMany(Project::class, 'user_id');
    }

    public function proposals()
    {
        return $this->hasMany(Proposal::class, 'student_id');
    }

    public function teamProposals()
    {
        return $this->belongsToMany(Proposal::class, 'proposal_student', 'user_id', 'proposal_id');
    }

    public function announcements()
    {
        return $this->hasMany(Announcement::class, 'created_by');
    }

    // public function getAvatarPathAttribute()
    // {
    //     if (! $this->avatar_url) {
    //         return null; // Fallback to initials if no image exists
    //     }

    //     return asset('storage/' . $this->avatar_url);
    // }
}
