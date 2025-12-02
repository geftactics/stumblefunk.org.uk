import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react';
import { vi, describe, test, beforeEach, afterEach, expect } from 'vitest';
import Login from './Login';

describe('Login', () => {
  beforeEach(() => {
    window.config = { apiUrl: 'https://api.example.com' };
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('calls login API and passes through success', async () => {
    const onLogin = vi.fn();
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ Message: 'USER' }),
    });

    render(
      <MemoryRouter>
        <Login onLogin={onLogin} />
      </MemoryRouter>
    );

    await act(async () => {
      await userEvent.type(screen.getByPlaceholderText(/access code/i), 'ABC123');
      await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    });

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/login',
        expect.objectContaining({
          method: 'POST',
        })
      )
    );
    await waitFor(() => expect(onLogin).toHaveBeenCalledWith('USER', 'ABC123'));
  });

  test('shows accreditation closed message when API returns CLOSED', async () => {
    const onLogin = vi.fn();
    global.fetch.mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({ Message: 'CLOSED' }),
    });

    render(
      <MemoryRouter>
        <Login onLogin={onLogin} />
      </MemoryRouter>
    );

    await act(async () => {
      await userEvent.type(screen.getByPlaceholderText(/access code/i), 'ABC123');
      await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    });

    expect(await screen.findByText(/accreditation is now closed/i)).toBeInTheDocument();
    expect(onLogin).not.toHaveBeenCalled();
  });

  test('shows invalid access code message on other failures', async () => {
    const onLogin = vi.fn();
    global.fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ Message: 'anything' }),
    });

    render(
      <MemoryRouter>
        <Login onLogin={onLogin} />
      </MemoryRouter>
    );

    await act(async () => {
      await userEvent.type(screen.getByPlaceholderText(/access code/i), 'ABC123');
      await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    });

    expect(await screen.findByText(/invalid access code/i)).toBeInTheDocument();
    expect(onLogin).not.toHaveBeenCalled();
  });
});
