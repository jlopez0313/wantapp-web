<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case COMERCIO = 'comercio';
    case USER = 'usuario';
    
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function fromName(string $name): self
    {
        return match(strtolower($name)) {
            'admin' => self::ADMIN,
            'comercio' => self::COMERCIO,
            'user' => self::USER,
            default => throw new \ValueError("$name no es un valor válido")
        };
    }
}