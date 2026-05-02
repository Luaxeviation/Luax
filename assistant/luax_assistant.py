import json
import sys


def respond(prompt, context):
    text = f"{prompt} {context}".lower()

    if "remote" in text or "client" in text or "server" in text:
        return {
            "mode": "python",
            "title": "RemoteEvent bridge",
            "answer": "A RemoteEvent is the message bridge. The LocalScript can ask for an action, but the server script must validate cooldowns, distance, ownership, currency, inventory, and damage before changing the real game.",
            "steps": [
                "Create a Remotes folder in ReplicatedStorage.",
                "Put RemoteEvents inside that folder with clear names.",
                "Fire from a LocalScript when a button, keybind, or tool is used.",
                "Handle OnServerEvent in ServerScriptService.",
                "Move shared rules into ModuleScripts so the project stays clean."
            ],
            "code": "Remotes.CastAbility.OnServerEvent:Connect(function(player, abilityId)\n    if not AbilityService.CanCast(player, abilityId) then return end\n    AbilityService.Cast(player, abilityId)\nend)"
        }

    if "animation" in text or "marker" in text or "hitframe" in text:
        return {
            "mode": "python",
            "title": "Animation markers to events",
            "answer": "Markers let animation and gameplay shake hands at the exact frame. Use them for hits, sounds, camera bumps, particles, combo windows, and end lag.",
            "steps": [
                "Make the animation in Roblox's Animation Editor.",
                "Add marker names such as HitFrame, Footstep, Cast, and EndLag.",
                "Load the animation on an Animator.",
                "Connect GetMarkerReachedSignal for each important marker.",
                "At the marker, call the correct local effect or validated server action."
            ],
            "code": "track:GetMarkerReachedSignal(\"HitFrame\"):Connect(function()\n    Remotes.Attack:FireServer(comboIndex)\nend)"
        }

    if "gui" in text or "button" in text or "ui" in text:
        return {
            "mode": "python",
            "title": "GUI to real game data",
            "answer": "The GUI should feel instant on the client, but anything valuable needs server approval. That means buttons can animate locally, then send a RemoteEvent for purchases, rewards, quests, or combat.",
            "steps": [
                "Build ScreenGui under StarterGui.",
                "Use LocalScripts for hover states, button clicks, and client feedback.",
                "Fire a RemoteEvent for purchases or game actions.",
                "Validate the request on the server.",
                "Send the updated value back to the client for the UI."
            ],
            "code": "button.Activated:Connect(function()\n    Remotes.BuyItem:FireServer(itemId)\nend)"
        }

    if "rpg" in text or "combat" in text or "deepwoken" in text:
        return {
            "mode": "python",
            "title": "RPG combat blueprint",
            "answer": "A serious RPG needs services, not one huge script. Use server services for state, cooldowns, abilities, hit validation, enemy AI, quests, inventory, data, and rewards. Use the client for input and effects.",
            "steps": [
                "Create AbilityData tables for every skill.",
                "Use AbilityService.Cast for all ability requests.",
                "Use StateService for stun, dodge, blocking, casting, and dead states.",
                "Use animation markers to line up hitboxes with motion.",
                "Keep damage and rewards on the server."
            ],
            "code": "function AbilityService.Cast(player, abilityId)\n    local ability = AbilityData[abilityId]\n    if not ability or not StateService.CanAct(player) then return end\n    ability.Run(player)\nend"
        }

    if "data" in text or "save" in text or "leaderstat" in text:
        return {
            "mode": "python",
            "title": "Saving safely",
            "answer": "Saving belongs on the server. Keep a profile table for each player, change that table through services, and save it on intervals plus PlayerRemoving.",
            "steps": [
                "Load the profile when PlayerAdded fires.",
                "Create leaderstats from the loaded profile.",
                "Change currency, XP, inventory, and quests through server services.",
                "Save on PlayerRemoving and on timed autosaves.",
                "Plan for DataStore limits and failed saves."
            ],
            "code": "Players.PlayerRemoving:Connect(function(player)\n    DataService.Save(player)\nend)"
        }

    return {
        "mode": "python",
        "title": "Learning path",
        "answer": "The fastest path is visual first, then code. Learn Studio panels, make simple parts react, add GUI, move real actions to the server, organize with ModuleScripts, then build full systems.",
        "steps": [
            "Studio basics: Explorer, Properties, Viewport, Output.",
            "Luau basics: variables, functions, tables, loops, events.",
            "GUI: ScreenGui, buttons, frames, constraints, LocalScripts.",
            "Networking: RemoteEvents, RemoteFunctions, validation.",
            "Systems: inventory, combat, farming, shops, quests, saving.",
            "Polish: animation markers, sounds, VFX, camera, feedback."
        ],
        "code": "local System = {}\nfunction System.Start(player)\n    print(\"Start small, link systems, test often\", player.Name)\nend\nreturn System"
    }


def main():
    try:
        payload = json.loads(sys.stdin.read() or "{}")
    except json.JSONDecodeError:
        payload = {}

    prompt = str(payload.get("prompt", ""))
    context = str(payload.get("context", ""))
    print(json.dumps(respond(prompt, context)))


if __name__ == "__main__":
    main()
