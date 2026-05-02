#include <algorithm>
#include <iostream>
#include <string>
#include <vector>

struct SkillCheck {
    std::string name;
    int xp;
};

int main(int argc, char** argv) {
    std::vector<SkillCheck> checks = {
        {"Studio basics", 40},
        {"Luau basics", 50},
        {"GUI", 75},
        {"RemoteEvents", 110},
        {"Animation markers", 130},
        {"RPG systems", 180}
    };

    int total = 0;
    for (const auto& check : checks) {
        total += check.xp;
    }

    std::string mode = argc > 1 ? argv[1] : "summary";
    if (mode == "max-xp") {
        std::cout << total << "\n";
        return 0;
    }

    auto hardest = std::max_element(checks.begin(), checks.end(), [](const SkillCheck& left, const SkillCheck& right) {
        return left.xp < right.xp;
    });

    std::cout << "Luax native helper\n";
    std::cout << "Total starter XP: " << total << "\n";
    std::cout << "Hardest starter skill: " << hardest->name << "\n";
    return 0;
}
