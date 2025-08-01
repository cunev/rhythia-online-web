// Generouted, changes to this file will be overridden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/`
  | `/clans`
  | `/clans/:id`
  | `/collections`
  | `/collections/:id`
  | `/collections/own`
  | `/copyright`
  | `/downloads`
  | `/leaderboards`
  | `/leaderboards/:flag`
  | `/leaderboards/mods`
  | `/maps`
  | `/maps/:id`
  | `/maps/criteria`
  | `/maps/find`
  | `/maps/upload`
  | `/player`
  | `/player/:id`
  | `/player/:id/scores`
  | `/privacy`
  | `/rules`
  | `/score/:id`
  | `/support`
  | `/terms`

export type Params = {
  '/clans/:id': { id: string }
  '/collections/:id': { id: string }
  '/leaderboards/:flag': { flag: string }
  '/maps/:id': { id: string }
  '/player/:id': { id: string }
  '/player/:id/scores': { id: string }
  '/score/:id': { id: string }
}

export type ModalPath = never

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>()
export const { redirect } = utils<Path, Params>()
