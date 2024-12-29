// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/`
  | `/clans`
  | `/clans/:id`
  | `/copyright`
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
  | `/rules`
  | `/score/:id`

export type Params = {
  '/clans/:id': { id: string }
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
