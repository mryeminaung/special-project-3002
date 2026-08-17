<?php

namespace App\Services;

use App\Models\AcademicYear;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class AcademicYearService
{
    public function list(): Collection
    {
        return AcademicYear::withCount(['proposals', 'projects'])
            ->orderByDesc('year')
            ->orderBy('semester')
            ->get();
    }

    public function create(array $data): AcademicYear
    {
        $data['label'] = AcademicYear::buildLabel($data['year'], (int) $data['semester']);

        return DB::transaction(function () use ($data) {
            if (! empty($data['is_active'])) {
                AcademicYear::where('is_active', true)->update(['is_active' => false]);
            }

            return AcademicYear::create($data);
        });
    }

    public function update(AcademicYear $academicYear, array $data): AcademicYear
    {
        $data['label'] = AcademicYear::buildLabel(
            $data['year'] ?? $academicYear->year,
            (int) ($data['semester'] ?? $academicYear->semester),
        );

        return DB::transaction(function () use ($academicYear, $data) {
            if (! empty($data['is_active'])) {
                AcademicYear::where('is_active', true)
                    ->where('id', '!=', $academicYear->id)
                    ->update(['is_active' => false]);
            }

            $academicYear->update($data);

            return $academicYear->fresh();
        });
    }

    public function setActive(AcademicYear $academicYear): AcademicYear
    {
        return DB::transaction(function () use ($academicYear) {
            AcademicYear::where('is_active', true)->update(['is_active' => false]);
            $academicYear->update(['is_active' => true]);

            return $academicYear->fresh();
        });
    }

    public function delete(AcademicYear $academicYear): bool
    {
        return $academicYear->delete();
    }

    public function getActive(): ?AcademicYear
    {
        return AcademicYear::where('is_active', true)->first();
    }
}
