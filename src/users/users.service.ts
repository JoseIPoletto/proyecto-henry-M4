async findOne(id: string) {
    const user = await this.userRepository.findOne({ 
        where: { id },
        select: ['id', 'email', 'name', 'phone', 'country', 'address', 'city'],
        relations: ['orders']
    });

    if (!user) {
        return null;
    }

    return {
        ...user,
        orders: user.orders.map(order => ({
            id: order.id,
            createdAt: order.createdAt
        }))
    };
} 